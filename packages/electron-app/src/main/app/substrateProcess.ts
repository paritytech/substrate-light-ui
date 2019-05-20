// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { spawn, ChildProcess } from 'child_process';

import { bundledPath, logger } from '../util';

let substrateProc: ChildProcess;

// TEMPORARY: change to runSubstrateLight once the light client is available.
export const runSubstrateDev = () => {
  logger.info('Running `substrate --dev`');
  const substrate = spawn(bundledPath, ['--dev']); // FIXME: --light

  substrate.stdout.on('data', data => logger.info(data.toString()));
  substrate.stderr.on('data', error => {
    logger.info(error.toString());
  });
  substrate.on('error', error => {
    logger.error(`Substrate process errored: ${error.toString()}`);
    purgeDevChain();
  });
  substrate.on('exit', code => {
    logger.error(`Substrate process exited with code: ${code && code.toString()}`);
  });

  substrateProc = substrate;
};

export const killSubstrate = () => {
  if (substrateProc) {
    logger.info('Killing Substrate');
    substrateProc.kill();
  }
};

export const purgeDevChain = () => {
  logger.info('Purging Substrate');
  // n.b. -y flag is used to skip interactive prompt.
  const purge = spawn(bundledPath, ['purge-chain', '--dev', '-y']); // FIXME: --light
  purge.stdout.once('data', data => {
    logger.info(`Purging chain: ${data.toString()}`);
    runSubstrateDev();
  });
  purge.stderr.on('data', stderr => logger.error(`Error while purging chain: ${stderr.toString()}`));
};
