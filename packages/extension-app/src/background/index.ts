// Copyright 2018-2020 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { JsonRpcRequest, JsonRpcResponse } from '@polkadot/rpc-provider/types';

// eslint-disable-next-line @typescript-eslint/camelcase
import init, { start_client } from '../../generated/polkadot_cli';
import ws from '../../generated/ws';
import { WasmClient } from '../types';

export type PayloadType = 'rpc.send' | 'rpc.sendSubscribe';

export interface PayloadRequest {
  jsonRpc: JsonRpcRequest;
  origin: 'content';
  type: PayloadType;
}

export interface PayloadResponse {
  jsonRpc: JsonRpcResponse;
  origin: 'background';
}

let client: WasmClient;

const start = async (): Promise<void> => {
  /* Load WASM */
  console.log('Loading WASM');
  await init('./polkadot_cli_bg.wasm');
  console.log('Successfully loaded WASM');

  /* Build our client. */
  console.log('Starting client');

  start_client(ws()).then((_client: WasmClient) => {
    console.log('Client started...', _client);
    client = _client;
  });
};

const rpcProxySend = (jsonRpc: JsonRpcRequest, port: browser.runtime.Port) => {
  client.rpcSend(JSON.stringify(jsonRpc)).then((res: string) => {
    try {
      port.postMessage({
        jsonRpc: JSON.parse(res),
        origin: 'background',
      });
    } catch (error) {
      console.error(`rpcProxySend: cannot parse ${res}`);
    }
  });
};

const rpcProxySubscribe = (jsonRpc: JsonRpcRequest, port: browser.runtime.Port) => {
  client.rpcSubscribe(JSON.stringify(jsonRpc), (res: string) => {
    try {
      port.postMessage({
        jsonRpc: JSON.parse(res),
        origin: 'background',
      });
    } catch (error) {
      console.error(`rpcProxySend: cannot parse ${res}`);
    }
  });
};

function handler(payload: PayloadRequest, port: browser.runtime.Port): void {
  console.log('handler', payload);
  const { jsonRpc, type } = payload;

  switch (type) {
    case 'rpc.send':
      return rpcProxySend(jsonRpc, port);
    case 'rpc.sendSubscribe':
      return rpcProxySubscribe(jsonRpc, port);
    default:
      throw new Error(`Unable to handle message of type ${type}`);
  }
}

start().catch(error => console.error(error));

// listen to all messages on the extension port and handle appropriately
browser.runtime.onConnect.addListener((port): void => {
  port.onMessage.addListener((response): void => {
    handler(response as PayloadRequest, port);
  });
  port.onDisconnect.addListener((): void => console.log(`Disconnected from ${port.name}`));
});
