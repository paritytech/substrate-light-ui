// Copyright 2018-2020 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { JsonRpcRequest, JsonRpcResponse } from '@polkadot/rpc-provider/types';
import { logger } from '@polkadot/util';
import { kusama_cc3, WasmRpcClient, westend } from '@substrate/light';

import { getClient, KUSAMA_CC3_WASM, start } from './client';

export type MessageType =
  | 'ping'
  | 'pong'
  | 'provider.switch'
  | 'rpc.send'
  | 'rpc.sendSubscribe';

/**
 * The message that the content script sends to the background script
 */
export interface MessageRequest {
  jsonRpc?: JsonRpcRequest | string;
  origin: 'content';
  type: MessageType;
}

/**
 * The message that the background script sends to the content script
 */
export interface MessageResponse {
  jsonRpc: JsonRpcResponse | boolean;
  origin: 'background';
  type: MessageType;
}

const l = logger('background');

function rpcProxySend(
  client: WasmRpcClient,
  jsonRpc: JsonRpcRequest,
  port: browser.runtime.Port
): void {
  client.rpcSend(JSON.stringify(jsonRpc)).then((res: string) => {
    try {
      port.postMessage({
        jsonRpc: JSON.parse(res),
        origin: 'background',
        type: 'rpc.send',
      });
    } catch (error) {
      l.error(`rpcProxySend: Error with ${res} - ${error.message}`);
    }
  });
}

function rpcProxySubscribe(
  client: WasmRpcClient,
  jsonRpc: JsonRpcRequest,
  port: browser.runtime.Port
): void {
  client.rpcSubscribe(JSON.stringify(jsonRpc), (res: string) => {
    try {
      port.postMessage({
        jsonRpc: { id: jsonRpc.id, ...JSON.parse(res) },
        origin: 'background',
        type: 'rpc.sendSubscribe',
      });
    } catch (error) {
      l.error(`rpcProxySubscribe: Error with ${res} - ${error.message}`);
    }
  });
}
/**
 * Handle a message from the content script
 *
 * @param payload - The message we received from the content script
 * @param port - The port representing the content script
 */
export function handler(
  payload: MessageRequest | undefined,
  port: browser.runtime.Port
): void {
  if (!payload) {
    l.warn('handler: Received empty handler, ignoring');
    return;
  }

  const { jsonRpc, origin, type } = payload;

  if (origin !== 'content') {
    l.warn(`handler: received message with origin ${origin}, ignorning`);
    return;
  }

  switch (type) {
    case 'ping':
      return port.postMessage({
        origin: 'background',
        type: 'pong',
      });

    case 'provider.switch': {
      const lightClient =
        jsonRpc === 'kusamaCc3'
          ? kusama_cc3.fromUrl(KUSAMA_CC3_WASM)
          : westend.fromUrl(KUSAMA_CC3_WASM);

      start(lightClient);

      break;
    }

    case 'rpc.send': {
      const client = getClient();
      if (!client) {
        console.warn(`handler: WASM client is not running`);
        return;
      }

      return rpcProxySend(client, jsonRpc as JsonRpcRequest, port);
    }

    case 'rpc.sendSubscribe': {
      const client = getClient();
      if (!client) {
        console.warn(`handler: WASM client is not running`);
        return;
      }

      return rpcProxySubscribe(client, jsonRpc as JsonRpcRequest, port);
    }

    default:
      l.warn(`Unable to handle message of type ${type}`);
  }
}
