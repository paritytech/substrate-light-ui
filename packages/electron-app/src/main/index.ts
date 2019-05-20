// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { app, BrowserWindow } from 'electron';
import path from 'path';
import url from 'url';

import { isSubstrateRunning } from './app/isSubstrateRunning';
import { initMenu } from './app/menu';
import { killSubstrate, runSubstrateDev } from './app/substrateProcess';
import { logger, staticPath } from './util';

// https://electronjs.org/docs/tutorial/security#electron-security-warnings
process.env.ELECTRON_ENABLE_SECURITY_WARNINGS = 'true';

let sluiApp: Electron.BrowserWindow | undefined;
let hasCalledInitParitySubstrate = false;

logger.info(`Platform detected: ${process.platform}`);
logger.info(`Process type: ${process.type}`);
logger.info(`Process ID: ${process.pid}`);
logger.info(`Process args: ${process.argv}`);
logger.info(`Electron version: ${process.versions['electron']}`);

initMenu();

app.once('ready', async () => {
  if (await isSubstrateRunning()) {
    // do nothing
    return;
  } else if (hasCalledInitParitySubstrate) {
    logger.error('Unable to initialise Parity Substrate more than once');
    return;
  } else {
    runSubstrateDev();
    hasCalledInitParitySubstrate = true;
  }

  createWindow();
});

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    killSubstrate();
    app.quit();
  }
});

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (sluiApp === undefined) {
    createWindow();
  }
});

// Make sure Substrate stops when UI stops
app.on('before-quit', killSubstrate);

app.on('will-quit', killSubstrate);

app.on('quit', () => {
  killSubstrate();
});

function createWindow () {
  sluiApp = new BrowserWindow({
    height: 1920,
    resizable: true,
    width: 1440,
    webPreferences: {
      allowRunningInsecureContent: false,
      contextIsolation: true, // prevent context sharing between renderer<->main processes
      devTools: true,
      enableBlinkFeatures: '', // https://electronjs.org/docs/tutorial/security#9-do-not-use-enableblinkfeatures
      enableRemoteModule: false,
      experimentalFeatures: false, // Do not set to true
      navigateOnDragDrop: false,
      nativeWindowOpen: true,
      nodeIntegration: false, // https://electronjs.org/docs/tutorial/security#2-disable-nodejs-integration-for-remote-content
      nodeIntegrationInWorker: false, // https://electronjs.org/docs/tutorial/security#2-disable-nodejs-integration-for-remote-content
      plugins: false,
      sandbox: true, // isolate all BrowserWindow instance environments
      safeDialogs: true,
      safeDialogsMessage: 'Electron consecutive dialog protection was triggered',
      webSecurity: true, // https://electronjs.org/docs/tutorial/security#5-do-not-disable-websecurity
      webviewTag: false // Associated with `will-attach-webview`
    }
  });

  sluiApp.loadURL(
    (process.env.NODE_ENV !== 'production' && process.env.ELECTRON_START_URL) ||
    url.format({
      pathname: path.join(staticPath, 'build', 'index.html'),
      protocol: 'file:',
      slashes: true
    })
  );

  sluiApp.on('closed', function () {
    sluiApp = undefined;
    killSubstrate();
  });
}
