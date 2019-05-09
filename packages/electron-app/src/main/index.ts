// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import electron from 'electron';
import installExtension, { REACT_DEVELOPER_TOOLS } from 'electron-devtools-installer';
import path from 'path';
import Pino from 'pino';
import url from 'url';

import { CSP, isSubstrateRunning, runSubstrateDev, staticPath } from './util';

const { app, BrowserWindow, session } = electron;
const pino = new Pino();
let sluiApp: Electron.BrowserWindow | undefined;
let substratePid: number;
let hasCalledInitParitySubstrate = false;

pino.info('Platform detected: ', process.platform);
pino.info('Process type: ', process.type);
pino.info('Process ID: ', process.pid);
pino.info('Process args: ', process.argv);
pino.info('Electron version: ', process.versions['electron']);

let substrateProc: import('child_process').ChildProcessWithoutNullStreams;

app.once('ready', async () => {

  const setPid = (pid: number) => {
    pino.info('setting substrate pid -> ', pid);
    substratePid = pid;
  };

  // https://electronjs.org/docs/tutorial/security#electron-security-warnings
  process.env.ELECTRON_ENABLE_SECURITY_WARNINGS = 'true';

  if (await isSubstrateRunning()) {
    pino.error('Substrate instance is allready running!');
    console.error('Substrate instance is allready running!');
    // do nothing
    pino.info('Substrate is running, do nothing.');
    return;
  } else if (hasCalledInitParitySubstrate) {
    pino.error('Unable to initialise Parity Substrate more than once');
    return;
  } else {
    runSubstrateDev(setPid);
    pino.info('Running Parity Substrate');
    hasCalledInitParitySubstrate = true;
  }

  createWindow();
});

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
    process.kill(substratePid);
  }
});

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (sluiApp === undefined) {
    createWindow();
  }
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
  });

  if (process.env.NODE_ENV !== 'production') {
    installExtension(REACT_DEVELOPER_TOOLS)
      .then((name: string) => console.log(`Added Extension:  ${name}`))
      .catch((err: string) => console.log('An error occurred: ', err));
  }

  // Content Security Policy (CSP)
  session.defaultSession!.webRequest.onHeadersReceived((details, callback) => {
    // Note: `onHeadersReceived` will not be called in prod, because we use the
    // file:// protocol: https://electronjs.org/docs/tutorial/security#csp-meta-tag
    // Instead, the CSP are the ones in the meta tag inside index.html
    pino.debug(
      'Configuring Content-Security-Policy for environment development'
    );

    callback({
      responseHeaders: {
        ...details.responseHeaders,
        'Content-Security-Policy': [CSP]
      }
    });
  });
}
