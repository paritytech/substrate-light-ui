// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import EventEmitter from 'events';

import {
    createWindow,
    // setupLogger,
    // setupGlobals,
    setupParitySubstrate
} from './methods';

let hasCalledInitSluiApp = false;

class SluiApp extends EventEmitter {
  app: any;

  constructor (electronApp: any) {
    super();

    // https://electronjs.org/docs/tutorial/security#electron-security-warnings
    process.env.ELECTRON_ENABLE_SECURITY_WARNINGS = 'true';

    if (hasCalledInitSluiApp) {
      this.emit(
            'error',
            new Error('Unable to initialise SLUI more than once')
            );
    }

    this.app = electronApp;

    this.createWindow();

    // this.setupDebug();
    // this.setupSecurity();
    // this.setupLogger();
    this.setupParitySubstrate();
    // this.setupGlobals();
  }

  createWindow = () => createWindow(this);
  // setupDebug = () => setupDebug(this);
  // setupGlobals = () => setupGlobals();
  // setupLogger = () => setupLogger();
  setupParitySubstrate = () => setupParitySubstrate(this);
}

export default SluiApp;
