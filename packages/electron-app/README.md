# electron-app

Build an Electron application, using `electron-webpack` and `electron-builder`.

## How it works

### `yarn build`

This command assumes that we've built a CRA app inside `packages/light-apps`. It will copy the built files into electron-webpack's `static/` folder, and tell Electron to serve these files.

### `yarn start`

Runs `electron-webpack dev`, which tells Electron to load http://localhost:3000, which is most likely the port on which CRA's dev mode runs. It reloads Electron on any code change inside the electron codebase.

## Electron Security Checklist:

https://electronjs.org/docs/tutorial/security#1-only-load-secure-content

Inspired by: https://github.com/paritytech/fether/pull/451

#### Cheatsheet

1. Only Load Secure Content (https/wss/ftps over http/ws/ftp)
2. Disable Node.js Integration for Remote Content

- Prevents XSS attacks from escalating to a Remote Code Execution Attack - limits the attack surface to the renderer process.
- **Node Integration + XSS in renderer process = RCE**
  <pre>
    const mainWindow = new BrowserWindow({
      webPreferences: {
        nodeIntegration: false,
        nodeIntegrationInWorker: false,
        preload: path.join(app.getAppPath(), 'preload.js')
      }
    });
  </pre>
- Good: instead of allowing full access to the Node API (including stuff like fs, io, etc.), only export necessary features via a preload script, making sure to validate arguments properly.

**N.B. SLUI: preload not necessary, as there's no need for main<->renderer communication (yet)**

3. Context Isolation - separates Javascript contexts between preload scripts and the page's scripts, and between Electon's internal scripts and the page's scripts, preventing so-called "Prototype Pollution Attacks", i.e. extra protection against RCE's.

- `contextIsolation` is false by default.
- this means by default, you have shared context between the preload scripts and the page's scripts, i.e. `window.variable` set in `preload.js` is defined in the `BrowserWindow`'s context.

**N.B. SLUI: again not a concern considering we don't need preload scripts at all, but good to keep in mind.**

4. Handle Session Permission Requests from Remote Content

- The default setting in Electron is to approve all permission requests unless the developer explicitly tells it to handle it a particular way.
  **N.B. SLUI: only some permissions matter in our context.**
  Required Permissions:

```
  contentSettings
  debugger: only Dev.
  desktopCapture: only Dev.
  fileBrowserHandler: This is needed for JSON File Recovery.
  idle: It could be a useful security measure in case user is AFK
  notifications: Yes - extend from Alerts.
```

- Electron implements the same types of permissions as Chromium as listed below:

```
  activeTab: we don't use tabs
  alarms: not needed
  background: not needed
  bookmarks: not needed
  browsingData: not needed
  certificateProvider: yes
  clipboardRead: no
  clipboardWrite: no
  contentSettings: only allow https, ftps, wss
  contextMenus: no
  cookies: no
  debugger: not needed in production, only in development environment.
  declarativeContent
  declarativeNetRequest: cannot see a need to block or redirect network requests ATOW.
  declarativeWebRequest: cannot see a need to block or redirect network requests ATOW.
  desktopCapture: disable in Production, enable in Development.
  displaySource: no.
  dns: no.
  documentScan: no
  downloads: no.
  enterprise.deviceAttributes: no.
  enterprise.hardwarePlatform: no.
  enterprise.platformKeys: no.
  experimental: no.
  fileBrowserHandler: This is needed for JSON File Recovery.
  fileSystemProvider: no need
  fontSettings: no need
  gcm: no need
  geolocation: definitely no need for this.
  history: no need | using react router
  identity: no need
  idle: It could be a useful security measure in case user is AFK
  management: no need
  nativeMessaging: no need
  networking.config: no need
  notifications: Yes.
  pageCapture: no need
  platformKeys: no need.
  power: no need.
  printerProvider: no need.
  privacy: no need.
  processes: no.
  proxy: no.
  sessions: no.
  signedInDevices: no.
  storage: no.
  system.cpu: no
  system.display: no
  system.memory: no
  system.storage: no
  tabCapture: no.
  tabs: no need
  topSites: no
  tts: nice for accessibility in the future but honestly probably not necessary.
  ttsEngine: nice for accessibility in the future but honestly probably not necessary.
  unlimitedStorage
  vpnProvider: no
  wallpaper: not needed
  webNavigation: no
  webRequest: no
  webRequestBlocking: no
```

5. Do Not Disable WebSecurity (default) - self explanatory
6. Define a Content Security Policy - not relevant (yet) as we're not loading any external web pages
7. Do Not Set allowRunningInsecureContent to true (default) - self explanatory
8. Do Not Enable Experimental Features (default) - self explanatory
9. Do Not Use enableBlinkFeatures (default) - self explanatory
10. Do Not Use allowpopups (default) - self explanatory
11. Verify WebView Options Before Creation:

- A WebView created in the renderer process will always create its own renderer process using its own `webPreferences`.

```
  app.on('web-contents-created', (event, contents) => {
    contents.on('will-attach-webview', (event, webPreferences, params) => {
      // Strip away preload scripts if unused or verify their location is legitimate
      delete webPreferences.preload
      delete webPreferences.preloadURL

      // Disable Node.js integration
      webPreferences.nodeIntegration = false

      // Verify URL being loaded
      if (!params.src.startsWith('https://example.com/')) {
        event.preventDefault()
      }
    })
  })
```

**N.B. SLUI: we don't load any webpages, and if we do in the future it'll be in a browser so this is not a concern.**

12. Disable or limit navigation

```
  const URL = require('url').URL

  app.on('web-contents-created', (event, contents) => {
    contents.on('will-navigate', (event, navigationUrl) => {
      const parsedUrl = new URL(navigationUrl)

      if (parsedUrl.origin !== 'https://example.com') {
        event.preventDefault()
      }
    })
  })
```

**N.B. SLUI: While not used yet, we may in the future want to navigate to the api docs page, or the forum, or other substrate related sites.**

13. Disable or limit creation of new windows

```
const { shell } = require('electron')

app.on('web-contents-created', (event, contents) => {
  contents.on('new-window', (event, navigationUrl) => {
    // if somehow there is a new-window event, block it.
    event.preventDefault()
  })
})
```

**N.B. SLUI: we just need the one BrowserWindow**

14. Do not use openExternal with untrusted content
15. Disable the remote module: the `remote` module would allow the renderer process to access APIs normally only available in the main process.

```
  const mainWindow = new BrowserWindow({
    webPreferences: {
      enableRemoteModule: false
    }
  })
```

16. Filter the remote module: relevant only if we cannot disable remote module.
