// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import { BrowserWindow } from 'electron';
import Pino from 'pino';

import { isSubstrateRunning } from '../../util';
import { runSubstrateDev } from '../../util/substrateProcess';

const pino = Pino();
let hasCalledInitParitySubstrate = false;

class ParitySubstrate {
  constructor (sluiWindow: BrowserWindow) {
    if (hasCalledInitParitySubstrate) {
      throw new Error('Unable to initialise Parity Substrate more than once');
    }

    /*
    * - If an instance of Parity Substrate is already running, we connect to it.
    * - If no instance of Parity Substrate is running, we run Parity
    *   Substrate from the static path / download and copy Parity Substrate to static path.
    */

    // Run the bundled Parity Substrate if needed and wanted
    // @ts-ignore
    return new Promise(async (resolve, reject) => {
      if (await this.isRunning()) {
        resolve(true);
        return;
      }

      // Parity Substrate isn't running: run the bundled binary
      this.run();
      pino.info('Running Parity Substrate');
      resolve(true);
    })
    .then(isRunning => {
      // Notify the renderers
      sluiWindow.webContents.send('substrate-running', isRunning);
      global.isSubstrateRunning = isRunning; // Send this variable to renderers via IPC
    });
  }

  isRunning = async () => {
    return isSubstrateRunning();
  }

  run = () => {
    return runSubstrateDev();
  }
}

export default ParitySubstrate;
