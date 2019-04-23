// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import electron from 'electron';
import installExtension, { REACT_DEVELOPER_TOOLS } from 'electron-devtools-installer';
import path from 'path';
import url from 'url';

import { staticPath } from './util/staticPath';

const { app, BrowserWindow } = electron;
let mainWindow: Electron.BrowserWindow | undefined;

// https://electronjs.org/docs/tutorial/security#electron-security-warnings
process.env.ELECTRON_ENABLE_SECURITY_WARNINGS = 'true';

function createWindow () {
  mainWindow = new BrowserWindow({
    height: 1920,
    resizable: true,
    width: 1440,
    webPreferences: {
      allowRunningInsecureContent: false,
      devTools: true,
      enableBlinkFeatures: '', // https://electronjs.org/docs/tutorial/security#9-do-not-use-enableblinkfeatures
      enableRemoteModule: false,
      experimentalFeatures: false, // Do not set to true
      contextIsolation: true, // prevent context sharing between renderer<->main processes
      navigateOnDragDrop: false,
      nativeWindowOpen: true,
      nodeIntegration: false, // https://electronjs.org/docs/tutorial/security#2-disable-nodejs-integration-for-remote-content
      nodeIntegrationInWorker: false, // https://electronjs.org/docs/tutorial/security#2-disable-nodejs-integration-for-remote-content
      plugins: false,
      sandbox: true, // isolate all BrowserWindow instance environments
      webSecurity: true, // https://electronjs.org/docs/tutorial/security#5-do-not-disable-websecurity
      webviewTag: false, // Associated with `will-attach-webview`
      safeDialogs: true,
      safeDialogsMessage: 'Electron consecutive dialog protection was triggered'
    }
  });

  mainWindow.loadURL(
    (process.env.NODE_ENV !== 'production' && process.env.ELECTRON_START_URL) ||
    url.format({
      pathname: path.join(staticPath, 'build', 'index.html'),
      protocol: 'file:',
      slashes: true
    })
  );

  if (process.env.NODE_ENV !== 'production') {
    installExtension(REACT_DEVELOPER_TOOLS)
      .then((name: string) => console.log(`Added Extension:  ${name}`))
      .catch((err: string) => console.log('An error occurred: ', err));
  }

  mainWindow.on('closed', () => {
    mainWindow = undefined;
  });
}

app.on('ready', createWindow);

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === undefined) {
    createWindow();
  }
});

app.on('web-contents-created', (event, contents) => {
  contents.on('will-attach-webview', (event, webPreferences, params) => {
    // Strip away preload scripts if unused or verify their location is legitimate
    delete webPreferences.preload;
    delete webPreferences.preloadURL;

    // Disable Node.js integration
    webPreferences.nodeIntegration = false;
  });
});

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
