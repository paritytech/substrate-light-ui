// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

// Ping ws://localhost:9944 for a response

import axios from 'axios';
import Pino from 'pino';

import { DEFAULT_WS_PORT, TRUSTED_LOOPBACK } from '../app/constants';

const pino = Pino();

const TIMEOUT_MS = 1000;

/**
 * Detect if another instance of Substrate is already running or not. To achieve
 * that, we just ping 127.0.0.1:9944.
 */
export async function isSubstrateRunning () {
  const wsInterface = TRUSTED_LOOPBACK;
  const wsPort = DEFAULT_WS_PORT;

  /**
   * Try to ping 9944 to test if Substrate is running.
   */
  const host = `http://${wsInterface}:${wsPort}`;

  try {
    await axios.get(host, { timeout: TIMEOUT_MS });
    pino.info('@substrate/electron:main')(
      `Another instance of substrate is already running on ${host}, skip running local instance.`
    );
    return true;
  } catch {
    return false;
  }
}
