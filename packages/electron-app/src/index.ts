// Copyright 2017-2018 @polkadot/light-apps authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import electron from 'electron';

const { app, BrowserWindow, ipcMain, session } = electron;
let mainWindow;

function createWindow () {
  mainWindow = new BrowserWindow({
    height: 1920,
    resizable: true,
    width: 1440
  });

  // Opens ELECTRON_START_URL
  mainWindow.loadURL(process.env.ELECTRON_START_URL);

  // Listen to messages from renderer process
  ipcMain.on('asynchronous-message', (...args) =>
    messages(mainWindow, ...args)
  );

  // Open external links in browser
  mainWindow.webContents.on('new-window', function (event, url) {
    event.preventDefault();
    electron.shell.openExternal(url);
  });

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
