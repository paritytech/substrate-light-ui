// Copyright 2018-2020 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import axios, { Method } from 'axios';

import { logger } from '../util';
import { DEFAULT_HTTP_PORT, TRUSTED_LOOPBACK } from './constants';

/**
 * Substrate apibroadcasts through WS on port 9944 and through HTTP on port 9933 by default.
 * Detect if another instance of Substrate is already running or not. To achieve
 * that, we just ping 127.0.0.1:9933.
 */
export async function isSubstrateRunning(): Promise<boolean> {
  /**
   * Try to ping 9933 to test if Substrate is running.
   */
  const host = `http://${TRUSTED_LOOPBACK}:${DEFAULT_HTTP_PORT}`;

  try {
    const options = {
      headers: { 'Content-Type': 'application/json' },
      method: 'POST' as Method,
      url: host,
    };

    await axios(options);
    logger.info(
      `Another instance of substrate is already running on ${host}, skip running local instance`
    );
    return true;
  } catch {
    logger.debug(`Cannot find any running instance of substrate on ${host}`);
    return false;
  }
}
