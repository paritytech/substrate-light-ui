// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import axios from 'axios';
import Pino from 'pino';

import { TRUSTED_LOOPBACK, DEFAULT_HTTP_PORT } from '../app/constants';

const pino = Pino();

const TIMEOUT_MS = 5000;

/**
 * Substrate apibroadcasts through WS on port 9944 and through HTTP on port 9933 by default.
 * Detect if another instance of Substrate is already running or not. To achieve
 * that, we just ping 127.0.0.1:9933.
 */
export async function isSubstrateRunning () {
  const wsInterface = TRUSTED_LOOPBACK;
  // const wsPort = DEFAULT_WS_PORT;
  const httpPort = DEFAULT_HTTP_PORT;

  /**
   * Try to ping 9933 to test if Substrate is running.
   */
  // const ws_host = `http://${wsInterface}:${wsPort}`;
  const httpHost = `http://${wsInterface}:${httpPort}`;

  try {
    console.log('Pinging 9933...');
    const options = {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      url: httpHost,
      timeout: TIMEOUT_MS
    };
    await axios(options);
    console.log('Done Pinging....');
    pino.info('@substrate/electron:main')(
      `Another instance of substrate is already running on ${httpHost}, skip running local instance.`
    );
    return true;
  } catch {
    console.log('Ping did not detect anything running on 9933...');
    return false;
  }
}
