// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import electron from 'electron';

const { BrowserWindow } = electron;

function createWindow (sluiApp: any) {

  sluiApp.emit('create-app');

  sluiApp.emit('create-window');

  sluiApp.win = new BrowserWindow();

  // Opens file:///path/to/build/index.html in prod mode, or whatever is
  // passed to ELECTRON_START_URL
  sluiApp.win.loadURL();

  sluiApp.emit('after-create-window');
}

export default createWindow;
