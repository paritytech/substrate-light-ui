// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

// Ping ws://localhost:9944 for a response

import axios from 'axios';
import Pino from 'pino';
const pino = Pino();

const TIMEOUT_MS = 1000;

interface IsSubstrateRunningOptions {
  wsInterface: string;
  wsPort: number | string;
}

/**
 * Detect if another instance of parity is already running or not. To achieve
 * that, we just ping 127.0.0.1:9944.
 */
export async function isSubstrateRunning(
    options: IsSubstrateRunningOptions = {
      wsInterface: '127.0.0.1',
      wsPort: '9944'
    }
) {

  return new Promise((resolve, reject) => {
    const { wsInterface, wsPort } = {
      wsInterface: '127.0.0.1',
      wsPort: '9944',
      ...options
    };

    /**
     * Try to ping 9944 to test if Substrate is running.
     */
    const host = `http://${wsInterface}:${wsPort}`;

    setTimeout(() => resolve(false), TIMEOUT_MS);

    axios
        .get(host)
        .then(_ => {
          pino.debug('@substrate/electron:main')(
            `Another instance of substrate is already running on ${host}, skip running local instance.`
            );
          resolve(true);
        })
        .catch(() => {
          return null;
        });
  });
}
