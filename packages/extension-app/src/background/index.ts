// Copyright 2018-2020 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

/// <reference types="chrome" />

// @ts-ignore
import extension from 'extensionizer';
// eslint-disable-next-line @typescript-eslint/camelcase
import init, { Client, start_client } from '../../generated/polkadot_cli';
import ws from '../../generated/ws';
import { sendMessage } from './sendMessage';
import { AnyJSON, MessageTypes, MessageRpcSend, PayloadTypes, TransportRequestMessage } from '../types';

// listen to all messages on the extension port and handle appropriately
extension.runtime.onConnect.addListener((port: any): void => {
  port.onMessage.addListener((data: any): void => {
    handler(
      data, 
      port
    );
  });
  port.onDisconnect.addListener((): void => console.log(`Disconnected from ${port.name}`));
});

function handler<TMessageType extends MessageTypes> (payload: TransportRequestMessage<TMessageType>, port: chrome.runtime.Port): void {
  // const sender: chrome.runtime.MessageSender | undefined = port.sender;
  const { message } = payload;

  console.log('*** background handler *** ');

  const subscriptionCallback = (message: string) => {
    console.log('subscrtion callback => ', message);
    port.postMessage(message);
  }

  switch(message) {
    case 'rpc.send':
      return wasmRunner.rpcProxySend(payload, port);
    case 'rpc.sendSubscribe':
      return wasmRunner.rpcProxySubscribe(payload, subscriptionCallback, port);
    default:
      throw new Error(`Unable to handle message of type ${message}`);
  }
}

class WasmRunner {
  public client: Client | undefined;

  constructor() {
    this.start();
  }

  public start = async (): Promise<void> => {
    /* Load WASM */
    console.log('Loading WASM');
    await init('./polkadot_cli_bg.wasm');
    console.log('Successfully loaded WASM');

    /* Build our client. */
    console.log('Starting client');

    start_client(ws()).then((_client: Client) => {
      console.log('Client started...', _client);
      this.client = _client;
    });
  };

  public rpcProxySend = (transportRequestMessage: TransportRequestMessage<any>, port: chrome.runtime.Port) => {
    const { id, message, request: { method, params } } = transportRequestMessage;

    if (message !== 'rpc.send') {
      return;
    }

    const payload = {
      method,
      params,
      id,
      jsonrpc: '2.0',
    };

    if (!this.client) {
      console.error('Client not yet started...');
    } else {
      this.client.rpcSend(JSON.stringify(payload))
        .then((r: AnyJSON) => {
          console.log(`Got a response! ${JSON.stringify(r)}`);
          port.postMessage(JSON.stringify(r));
        });
    }
  };

  public rpcProxySubscribe = (transportRequestMessage: TransportRequestMessage<any>, cb: (message: string) => void, port: chrome.runtime.Port) => {
    console.log('trying to rpc proxy subscribe...');
    const { id, message, request: { method, params } } = transportRequestMessage;

    if (message !== 'rpc.sendSubscribe') {
      console.log('message needs to be rpc.sendSUBSCRIBE IN HERE');
      return;
    }

    if (!this.client) {
      console.error('Client not yet started...');
    } else {
      const payload = {
        method,
        params,
        id,
        jsonrpc: '2.0',
      };

      this.client.rpcSubscribe(JSON.stringify(payload), (r: AnyJSON) => {
        console.log('new subsscription resutl -> ', r);
        cb(JSON.stringify(r));
      });
    };
  }
}

const wasmRunner = new WasmRunner();