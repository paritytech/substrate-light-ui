// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import electron from 'electron';
import installExtension, { REACT_DEVELOPER_TOOLS } from 'electron-devtools-installer';
import path from 'path';
import Pino from 'pino';
import url from 'url';
const { BrowserWindow, session } = electron;

import { CSP, staticPath } from '../../util';
const pino = Pino();

function createWindow (sluiApp: any) {
  sluiApp.emit('create-window');

  sluiApp.win = new BrowserWindow({
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

  sluiApp.win.loadURL(
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

  sluiApp.win.on('closed', () => {
    sluiApp = undefined;
  });

  sluiApp.emit('create-app');

  sluiApp.emit('after-create-window');
}

export default createWindow;
