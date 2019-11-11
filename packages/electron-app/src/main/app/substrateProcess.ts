// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { spawn, ChildProcess } from 'child_process';

import { bundledPath, logger } from '../util';

let substrateProc: ChildProcess;

// TEMPORARY: change to runSubstrateLight once the light client is available.
export const runSubstrateDev = (): void => {
  if (substrateProc) {
    logger.error('Unable to initialise Parity Substrate more than once');
    return;
  }

  logger.info('Running `substrate --dev`');
  const substrate = spawn(bundledPath, ['--dev']); // FIXME: --light

  substrate.stdout.on('data', data => {
    logger.info(data.toString());
  });
  substrate.stderr.on('data', error => {
    // Substrate outputs in stderr, so we .info here
    logger.info(error.toString());
  });
  substrate.on('error', error => {
    logger.error(`Substrate process errored: ${error.toString()}`);
  });
  substrate.on('exit', code => {
    logger.debug(`Substrate process exited with code: ${code && code.toString()}`);
  });

  substrateProc = substrate;
};

export const killSubstrate = (): void => {
  if (substrateProc) {
    logger.info('Killing Substrate');
    substrateProc.kill();
  }
};
