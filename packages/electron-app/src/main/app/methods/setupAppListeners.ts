// Copyright 2015-2019 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

import Pino from 'pino';

const pino = Pino();

function setupAppListeners (sluiApp: any) {
  sluiApp.on('create-app', () => {
    pino.info(
      `Starting Substrate Light UI...`
    );
  });

  sluiApp.on('create-window', () => {
    pino.info('Creating window');
  });

  sluiApp.on('after-create-window', () => {
    pino.info('Finished creating window');
  });

  sluiApp.on('load-tray', () => {
    pino.info('Configuring taskbar mode for the window');
  });

  sluiApp.on('show-window', () => {
    pino.info('Showing window');
  });

  sluiApp.on('after-show-window', () => {
    pino.info('Finished showing window');
  });

  sluiApp.on('after-create-app', () => {
    pino.info(`Ready to use Substrate Light UI`);
  });

  sluiApp.on('minimize-window', () => {
    pino.info('Minimized window');
  });

  sluiApp.on('hide-window', () => {
    pino.info('Hiding window');
  });

  sluiApp.on('after-hide-window', () => {
    pino.info('Finished hiding window');
  });

  sluiApp.on('blur-window', () => {
    pino.info('Blur window');
  });

  sluiApp.on('moved-window-up-into-view', () => {
    pino.info('Moved window up into view');
  });

  sluiApp.on('after-close-window', () => {
    pino.info('Deleted window upon close');
  });

  sluiApp.on('error', (error: any) => {
    console.error(error);
  });
}

export default setupAppListeners;
