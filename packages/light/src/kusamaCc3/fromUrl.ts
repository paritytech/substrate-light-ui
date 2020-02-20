// Copyright 2018-2020 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

// eslint-disable-next-line @typescript-eslint/camelcase
import init, { start_client } from '../generated/kusamaCc3/kusamaCc3';
import { LightClient, WasmRpcClient } from '../types';
import ws from '../ws';
import chainSpec from './kusama.json';

const name = 'kusamaCc3';
const version = 'v0.7.20';
let client: WasmRpcClient;

/**
 * Create a light client by fetching the WASM blob from an URL.
 */
export function fromUrl(url = './kusamaCc3.wasm'): LightClient {
  return {
    name,
    async startClient(): Promise<WasmRpcClient> {
      if (client) {
        return client;
      }

      console.log(`Loading light client "${name}-${version}" from ${url}...`);
      await init(url);
      console.log('Successfully loaded WASM, starting client...');

      client = await start_client(JSON.stringify(chainSpec), ws());

      return client;
    },
    version,
  };
}
