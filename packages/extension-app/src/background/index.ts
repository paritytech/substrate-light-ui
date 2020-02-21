// Copyright 2018-2020 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { JsonRpcRequest, JsonRpcResponse } from '@polkadot/rpc-provider/types';
import { logger } from '@polkadot/util';
import {
  kusamaCc3,
  LightClient,
  WasmRpcClient,
  westend,
} from '@substrate/light';
import extensionizer from 'extensionizer';

// We bundled the .wasm file inside the extension
const KUSAMA_CC3_WASM = './wasm/kusamaCc3.wasm';

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

// Store the client here. For now, we can only allow one light client running
// at a time.
let _client: WasmRpcClient;

/**
 * Start a WASM client
 */
async function start(lightClient: LightClient): Promise<void> {
  _client = await lightClient.startClient();
}

function rpcProxySend(
  client: WasmRpcClient,
  jsonRpc: JsonRpcRequest,
  port: browser.runtime.Port
): void {
  client.rpcSend(JSON.stringify(jsonRpc)).then((res: string) => {
    try {
      console.log('RETURNING', JSON.parse(res));
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
function handler(
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
      l.log('Killing WASM light client...');
      // Destroy old light client
      _client.free();
      // Start a new one
      l.log(`Running new WASM light client: ${jsonRpc}`);
      const clientPromise =
        jsonRpc === 'kusamaCc3'
          ? kusamaCc3.fromUrl(KUSAMA_CC3_WASM)
          : westend.fromUrl(KUSAMA_CC3_WASM);

      clientPromise.startClient().catch(error => console.error(error));

      break;
    }
    case 'rpc.send':
      return rpcProxySend(_client, jsonRpc as JsonRpcRequest, port);
    case 'rpc.sendSubscribe':
      return rpcProxySubscribe(_client, jsonRpc as JsonRpcRequest, port);
    default:
      l.warn(`Unable to handle message of type ${type}`);
  }
}

extensionizer.runtime.onConnect.addListener(
  (port: browser.runtime.Port): void => {
    // Listen to all messages on the extension port and handle appropriately
    function messageListener(response: object): void {
      handler(response as MessageRequest, port);
    }
    port.onMessage.addListener(messageListener);

    // Gracefully handle port disconnects
    function disconnectListener(): void {
      if (port.onMessage.hasListener(messageListener)) {
        port.onMessage.removeListener(messageListener);

        l.log(`Disconnected from ${JSON.stringify(port)}`);
      }

      if (port.onDisconnect.hasListener(disconnectListener)) {
        port.onDisconnect.removeListener(disconnectListener);
      }
    }
    port.onDisconnect.addListener(disconnectListener);
  }
);

// At the beginning, just run Kusama
start(kusamaCc3.fromUrl(KUSAMA_CC3_WASM)).catch(error => console.error(error));
