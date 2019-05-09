// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

// Ping ws://localhost:9944 for a response

import axios from 'axios';
import Pino from 'pino';

import { DEFAULT_HTTP_PORT, TRUSTED_LOOPBACK } from '../app/constants';

const pino = Pino();

/**
 * Detect if another instance of Substrate is already running or not. To achieve
 * that, we just ping 127.0.0.1:9933.
 */
export async function isSubstrateRunning () {
  /**
   * Try to ping 9933 to test if Substrate is running.
   */
  const host = `http://${TRUSTED_LOOPBACK}:${DEFAULT_HTTP_PORT}`;

  try {
    const options = {
      headers: { 'Content-type': 'application/json' },
      method: 'POST',
      url: host
    };

    await axios(options);
    pino.info(`@substrate/electron:main | Another instance of substrate is already running on ${host}, skip running local instance.`);
    return true;
  } catch {
    pino.info(`@substrate/electron:main | Did not detect anything running on ${host}... proceed with running the local instance`);
    return false;
  }
}
