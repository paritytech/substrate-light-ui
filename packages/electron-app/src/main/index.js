
import electron from 'electron';
import path from 'path';
import url from 'url';

import { productName } from '../../electron-builder.json';

const { app, BrowserWindow, ipcMain } = electron;
let mainWindow;

function createWindow () {
  mainWindow = new BrowserWindow({
    height: 1920,
    resizable: true,
    width: 1440
  });

  mainWindow.loadURL(
    process.env.ELECTRON_START_URL
  );

  // Listen to messages from renderer process
  ipcMain.on('asynchronous-message', (...args) =>
    messages(mainWindow, ...args)
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
