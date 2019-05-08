// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { spawn } from 'child_process';
import Pino from 'pino';

const pino = Pino();

import { bundledPath } from './staticPath';

// TEMPORARY: change to runSubstrateLight once the light client is available.
export const runSubstrateDev = () => {
  const substrate = spawn(bundledPath, ['--dev']); // FIXME: --light

  substrate.stdout.on('data', data => pino.info(data.toString()));
  substrate.stderr.on('data', error => {
    pino.error(error.toString());
  });
  substrate.on('error', error => {
    pino.error('Substrate process errored => ', error.toString());
    purgeDevChain();
  });
  substrate.on('exit', code => {
    pino.error('Substrate process exited with code -> ', code && code.toString());
  });
};

export const purgeDevChain = () => {
  // n.b. -y flag is used to skip interactive prompt.
  const purge = spawn(bundledPath, ['purge-chain', '--dev', '-y']); // FIXME: --light
  purge.stdout.once('data', data => {
    pino.info('Purging chain => ', data.toString());
    runSubstrateDev();
  });
  purge.stderr.on('data', stderr => pino.error('Error while purging chain => ', stderr.toString()));
};
