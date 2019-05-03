// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { spawn } from 'child_process';

// TEMPORARY: change to runSubstrateLight once the light client is available.
export const runSubstrateDev = () => {
  const substrate = spawn('substrate', ['--dev']);

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
  const purge = spawn('substrate', ['purge-chain', '--dev']);
  // it prompts y/n here so it hangs until there's user input.
  purge.stdout.on('data', data => {
    purge.stdin.write('y');
    console.log('purging chain ->>> ', data.toString());
    runSubstrateDev();
  });
  purge.stderr.on('data', stderr => console.error('purge chain -error => ', stderr.toString()));
};