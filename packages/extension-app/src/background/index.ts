// Copyright 2018-2020 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

// eslint-disable-next-line @typescript-eslint/camelcase
import init, { start_client } from '../../generated/polkadot_cli';
import ws from '../../generated/ws';
import { AnyJSON } from '../types';

async function start(): Promise<void> {
  /* Load WASM */
  console.log('Loading WASM');
  await init('./polkadot_cli_bg.wasm');
  console.log('Successfully loaded WASM');

  /* Build our client. */
  console.log('Starting client');
  const client = start_client(ws());
  console.log('Client started', JSON.stringify(client));

  /* A) Use the client directly */
  // FIXME: use B
  // https://github.com/paritytech/substrate-light-ui/issues/52
  client.rpcSubscribe('{"method":"chain_subscribeNewHead","params":[],"id":1,"jsonrpc":"2.0"}', (r: AnyJSON) =>
    console.log('[client] New chain head: ' + r)
  );
  client
    .rpcSend('{"method":"system_networkState","params":[],"id":1,"jsonrpc":"2.0"}')
    .then((r: AnyJSON) => console.log('[client] Network state: ' + r));

  /* B) Use WasmProviderLite */
  // const wasmProviderLite = new PostMessageProvider(client);
  // wasmProviderLite.send('system_networkState', []).then(r => {
  //   console.log('[WasmProviderLite] system_networkState resolved with', r);
  // });
  // wasmProviderLite.subscribe('n/a', 'chain_subscribeNewHead', [], (err: any, r: any) =>
  //   console.log('[WasmProviderLite] Subscription notification : new chain head: ', r)
  // );
}

start().catch(error => console.error(`Something unexpected went wrong: ${error}`));
