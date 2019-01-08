// Copyright 2017-2018 @polkadot/light-apps authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import electron from 'electron';

const { app, BrowserWindow } = electron;
let mainWindow: Electron.BrowserWindow | null;

function createWindow () {
  mainWindow = new BrowserWindow({
    height: 1920,
    resizable: true,
    width: 1440
  });

  mainWindow.loadURL(
    process.env.ELECTRON_START_URL || 'http://127.0.0.1:3000'
  );

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.on('ready', createWindow);

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});
