// Copyright 2018-2020 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

// eslint-disable-next-line @typescript-eslint/camelcase
import init, { start_client } from '../generated/kusamaCc3/polkadot_cli'; // Use kusama's wasm blob
import ws from '../generated/ws';
import { LightClient, WasmRpcClient } from '../types';
import chainSpec from './westend.json';

const name = 'westend';
const version = 'v0.7.20';
let client: WasmRpcClient;

export const westend: LightClient = {
  name,
  async startClient() {
    if (client) {
      return client;
    }

    console.log(`Loading ${name}-${version} WASM...`);
    await init('./polkadot_cli_bg.wasm');
    console.log('Successfully loaded WASM, starting client...');

    client = await start_client(JSON.stringify(chainSpec), ws());

    return client;
  },
  version,
};
