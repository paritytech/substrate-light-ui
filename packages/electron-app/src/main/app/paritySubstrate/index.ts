// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import Pino from 'pino';

import { isSubstrateRunning } from '../../util';
import { runSubstrateDev } from '../../util/substrateProcess';

const pino = Pino();
let hasCalledInitParitySubstrate = false;

class ParitySubstrate {
  constructor () {
    if (hasCalledInitParitySubstrate) {
      throw new Error('Unable to initialise Parity Substrate more than once');
    }

    /*
    * - If an instance of Parity Substrate is already running, we connect to it.
    * - If no instance of Parity Substrate is running, we run Parity
    *   Substrate from the static path.
    */

    // Run the bundled Parity Substrate if needed and wanted

    return new Promise(async (resolve, reject) => {
      if (await isSubstrateRunning()) {
        resolve(true);
        return;
      }

      // Parity Substrate isn't running: run the bundled binary
      runSubstrateDev();
      pino.info('Running Parity Substrate');
      resolve(true);
    });
  }
}

export default ParitySubstrate;
