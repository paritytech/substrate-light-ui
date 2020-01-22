// Copyright 2018-2020 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

/// <reference types="chrome" />

// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
import extension from 'extensionizer';

// eslint-disable-next-line @typescript-eslint/camelcase
import init, { start_client } from '../../generated/polkadot_cli';
import ws from '../../generated/ws';
import { MessageTypes, TransportRequestMessage, WasmClient } from '../types';

extension.browserAction.setBadgeBackgroundColor({ color: '#d90000' });

let client: WasmClient;
let isClientReady = false;

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

start().then(() => {
  isClientReady = true;
});

const rpcProxySend = (transportRequestMessage: TransportRequestMessage<any>, port: chrome.runtime.Port) => {
  const {
    id,
    message,
    request: { method, params },
  } = transportRequestMessage;

  if (message !== 'rpc.send') {
    return;
  }

  const payload = {
    method,
    params,
    id,
    jsonrpc: '2.0',
  };

  if (!isClientReady) {
    console.error('Client not yet started...');
  } else {
    client.rpcSend(JSON.stringify(payload)).then((r: string) => {
      port.postMessage(r);
    });
  }
};

const rpcProxySubscribe = (transportRequestMessage: TransportRequestMessage<any>, cb: (message: string) => void) => {
  console.log('trying to rpc proxy subscribe...');
  const {
    id,
    message,
    request: { method, params },
  } = transportRequestMessage;

  if (message !== 'rpc.sendSubscribe') {
    console.log('message needs to be rpc.sendSUBSCRIBE IN HERE');
    return;
  }

  if (!isClientReady) {
    console.error('Client not yet started...');
  } else {
    const payload = {
      method,
      params,
      id,
      jsonrpc: '2.0',
    };

    client.rpcSubscribe(JSON.stringify(payload), (r: string) => {
      const subscriptionResult = JSON.parse(r);
      const result = {
        ...subscriptionResult,
        id: subscriptionResult.params.subscription,
        subscription: subscriptionResult.params.subscription,
      };

      console.log('rpc.subscribe result -> ', result);

      cb(JSON.stringify(result)); // port.postMessage
    });
  }
};

function handler<TMessageType extends MessageTypes>(
  payload: TransportRequestMessage<TMessageType>,
  port: chrome.runtime.Port
): void {
  const { id, message } = payload;

  console.log('*** background handler *** ');

  const subscriptionCallback = (result: string) => {
    const transportSubscriptionNotification = {
      subscriptionId: id,
      type: message,
      result,
    };

    console.log('transport subscription NOtification => ', transportSubscriptionNotification);

    port.postMessage(JSON.stringify(transportSubscriptionNotification));
  };

  switch (message) {
    case 'rpc.send':
      return rpcProxySend(payload, port);
    case 'rpc.sendSubscribe':
      return rpcProxySubscribe(payload, subscriptionCallback);
    default:
      throw new Error(`Unable to handle message of type ${message}`);
  }
}

// listen to all messages on the extension port and handle appropriately
extension.runtime.onConnect.addListener((port: any): void => {
  port.onMessage.addListener((data: any): void => {
    handler(data, port);
  });
  port.onDisconnect.addListener((): void => console.log(`Disconnected from ${port.name}`));
});
