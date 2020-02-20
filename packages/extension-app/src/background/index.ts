// Copyright 2018-2020 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { JsonRpcRequest, JsonRpcResponse } from '@polkadot/rpc-provider/types';
import { logger } from '@polkadot/util';
import { kusamaCc3, LightClient, WasmRpcClient } from '@substrate/light';
import extensionizer from 'extensionizer';

export type MessageAction =
  | 'ping'
  | 'pong'
  | 'provider.switch'
  | 'rpc.send'
  | 'rpc.sendSubscribe';

/**
 * The message that the content script sends to the background script
 */
export interface PayloadRequest {
  jsonRpc: JsonRpcRequest;
  origin: 'content';
  type: MessageAction;
}

/**
 * The message that the background script sends to the content script
 */
export interface PayloadResponse {
  jsonRpc: JsonRpcResponse;
  origin: 'background';
  type: MessageAction;
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
  payload: PayloadRequest | undefined,
  port: browser.runtime.Port
): void {
  if (!payload) {
    l.warn('handler: Received empty handler, ignoring');
    return;
  }

  const { jsonRpc, type } = payload;

  switch (type) {
    case 'ping':
      return port.postMessage({
        origin: 'background',
        type: 'pong',
      });
    case 'provider.switch': {
      // Destroy old light client
      _client.free();
      // Start a new one
      break;
    }
    case 'rpc.send':
      return rpcProxySend(_client, jsonRpc, port);
    case 'rpc.sendSubscribe':
      return rpcProxySubscribe(_client, jsonRpc, port);
    default:
      l.warn(`Unable to handle message of type ${type}`);
  }
}

extensionizer.runtime.onConnect.addListener(
  (port: browser.runtime.Port): void => {
    // Listen to all messages on the extension port and handle appropriately
    function messageListener(response: object): void {
      handler(response as PayloadRequest, port);
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

start(kusamaCc3.fromUrl('./wasm/kusamaCc3.wasm')).catch(error =>
  console.error(error)
);
