// Copyright 2018-2020 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { JsonRpcRequest, JsonRpcResponse } from '@polkadot/rpc-provider/types';
import { logger } from '@polkadot/util';

// eslint-disable-next-line @typescript-eslint/camelcase
import init, { start_client } from '../../generated/polkadot_cli';
import ws from '../../generated/ws';
import { WasmClient } from '../types';

export type PayloadType = 'ping' | 'pong' | 'rpc.send' | 'rpc.sendSubscribe';

/**
 * The message that the content script sends to the background script
 */
export interface PayloadRequest {
  jsonRpc: JsonRpcRequest;
  origin: 'content';
  type: PayloadType;
}

/**
 * The message that the background script sends to the content script
 */
export interface PayloadResponse {
  jsonRpc: JsonRpcResponse;
  origin: 'background';
  type: PayloadType;
}

let client: WasmClient;
const l = logger('background');

/**
 * Start a WASM client
 */
const start = async (): Promise<void> => {
  /* Load WASM */
  l.log('Loading WASM');
  await init('./polkadot_cli_bg.wasm');
  l.log('Successfully loaded WASM');

  /* Build our client. */
  l.log('Starting client');

  start_client(ws()).then((_client: WasmClient) => {
    l.log('Client started...', _client);
    client = _client;
  });
};

function rpcProxySend(jsonRpc: JsonRpcRequest, port: browser.runtime.Port): void {
  client.rpcSend(JSON.stringify(jsonRpc)).then((res: string) => {
    try {
      port.postMessage({
        jsonRpc: JSON.parse(res),
        origin: 'background',
        type: 'rpc.send',
      });
    } catch (error) {
      console.error(`rpcProxySend: cannot parse ${res}`);
    }
  });
}

function rpcProxySubscribe(jsonRpc: JsonRpcRequest, port: browser.runtime.Port): void {
  client.rpcSubscribe(JSON.stringify(jsonRpc), (res: string) => {
    try {
      port.postMessage({
        jsonRpc: { id: jsonRpc.id, ...JSON.parse(res) },
        origin: 'background',
        type: 'rpc.sendSubscribe',
      });
    } catch (error) {
      console.error(`rpcProxySubscribe: cannot parse ${res}`);
    }
  });
}

/**
 * Handle a message from the content script
 *
 * @param payload - The message we received from the content script
 * @param port - The port representing the content script
 */
function handler(payload: PayloadRequest | undefined, port: browser.runtime.Port): void {
  if (!payload) {
    console.warn('handler: Received empty handler, ignoring');
    return;
  }

  const { jsonRpc, type } = payload;

  switch (type) {
    case 'ping':
      return port.postMessage({
        origin: 'background',
        type: 'pong',
      });
    case 'rpc.send':
      return rpcProxySend(jsonRpc, port);
    case 'rpc.sendSubscribe':
      return rpcProxySubscribe(jsonRpc, port);
    default:
      console.warn(`Unable to handle message of type ${type}`);
  }
}

start()
  .then(() => {
    browser.runtime.onConnect.addListener((port): void => {
      // Listen to all messages on the extension port and handle appropriately
      port.onMessage.addListener((response): void => {
        handler(response as PayloadRequest, port);
      });
      port.onDisconnect.addListener((): void => console.log(`Disconnected from ${port.name}`));
    });
  })
  .catch(error => console.error(error));
