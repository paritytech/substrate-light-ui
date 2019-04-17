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
  * Prevents XSS attacks from escalating to a Remote Code Execution Attack - limits the attack surface to the renderer process.
  <pre>
  const mainWindow = new BrowserWindow({
    webPreferences: {
      nodeIntegration: false,
      nodeIntegrationInWorker: false,
      preload: path.join(app.getAppPath(), 'preload.js')
    }
    })
  </pre>
3. 
