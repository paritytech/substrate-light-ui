// Copyright 2018-2020 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { logger } from '@polkadot/util';
import { LightClient, WasmRpcClient } from '@substrate/light';

// We bundled the .wasm file inside the extension
export const KUSAMA_CC3_WASM = './wasm/kusama_cc3.wasm';

const l = logger('background');

// Store the client here. For now, we can only allow one light client running
// at a time. It might be undefined, for example when we're killing it and
// spawning a new one.
let _client: WasmRpcClient | undefined;

/**
 * Start a WASM client, killing the old on if it existed.
 */
export async function start(lightClient: LightClient): Promise<void> {
  try {
    if (_client) {
      // Destroy old light client
      _client.free();
      _client = undefined;
      l.log('Old WASM light client killed...');
    }

    // Start a new one
    _client = await lightClient.startClient();
  } catch (error) {
    console.error(error);
  }
}

/**
 * Get the current running WASM client.
 */
export function getClient(): WasmRpcClient | undefined {
  return _client;
}
