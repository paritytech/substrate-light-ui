// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { spawn } from 'child_process';
import { staticPath } from '.';

// TEMPORARY: change to runSubstrateLight once the light client is available.
export const runSubstrateDev = () => {
  const substrate = spawn(`${staticPath}/substrate/target/release/substrate`, ['--dev']); // FIXME: --light

  substrate.stdout.on('data', data => console.log('stdout => ', data.toString()));
  substrate.stderr.on('data', error => {
    console.log('stderr => ', error.toString());
  });
  substrate.on('exit', code => {
    console.log('substrate process exited with code -> ', code && code.toString());
    purgeDevChain();
  });
};

export const purgeDevChain = () => {
  // n.b. -y flag is used to skip interactive prompt.
  const purge = spawn(`${staticPath}/substrate/target/release/substrate`, ['purge-chain', '--dev', '-y']); // FIXME: --light
  purge.stdout.once('data', data => {
    console.log('Purging chain => ', data.toString());
    runSubstrateDev();
  });
  purge.stderr.on('data', stderr => console.error('Error while purging chain => ', stderr.toString()));
};
