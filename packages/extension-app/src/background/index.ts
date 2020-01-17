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
import { AnyJSON, MessageTypes, TransportRequestMessage, MessageRpcSend } from '../types';

function handler<TMessageType extends MessageTypes> (payload: TransportRequestMessage<TMessageType>, messageCb: (message: string) => void, port: chrome.runtime.Port): void {
  const sender: chrome.runtime.MessageSender | undefined = port.sender;
  const { id, message, request } = payload;

  console.log('*** background handler *** ');

  switch(message) {
    case 'rpc.send':
      return wasmRunner.rpcProxySend(payload, port);
    case 'rpc.sendSubscribe':
      return wasmRunner.rpcProxySubscribe(payload, messageCb, port);
    default:
      throw new Error(`Unable to handle message of type ${message}`);
  }
}

// listen to all messages on the extension port and handle appropriately
extension.runtime.onConnect.addListener((port: any): void => {
  console.log('extension.runtime.onconnect() -> ', port);
  console.log('Port name: ', port.name);
  port.onMessage.addListener((message: any): void => {
    console.log('background extensino.runtime.onConnect listner s=> ',  message);
    handler(message, (message) => { port.postMessage(message) }, port);
  });
  port.onDisconnect.addListener((): void => console.log(`Disconnected from ${port.name}`));
});

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

    if (!this.client) {
      return;
    }

    if (message !== 'rpc.sendSubscribe') {
      return;
    }

    const payload = {
      method,
      params,
      id,
      jsonrpc: '2.0',
    };

    // client.rpcSubscribe('{"method":"chain_subscribeNewHead","params":[],"id":1,"jsonrpc":"2.0"}', (r: AnyJSON) =>
    //   console.log('[client] New chain head: ' + r)

    this.client.rpcSubscribe(JSON.stringify(payload), (r: AnyJSON) => {
      console.log('new subsscription resutl -> ', JSON.stringify(r));
      cb(JSON.stringify(r));
    });
  };
}

const wasmRunner = new WasmRunner();