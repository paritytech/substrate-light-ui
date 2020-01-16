// Copyright 2018-2020 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

/// <reference types="chrome" />

import extension from 'extensionizer';
// eslint-disable-next-line @typescript-eslint/camelcase
import init, { start_client } from '../../generated/polkadot_cli';
import ws from '../../generated/ws';
import { AnyJSON, MessageTypes, TransportRequestMessage } from '../types';

// listen to all messages on the extension port and handle appropriately
extension.runtime.onConnect.addListener((port: any): void => {
  console.log('extension.runtime.onconnect() -> ', port);
  console.log('Port name: ', port.name);
  port.onMessage.addListener((data: any): void => {
    console.log('background extensino.runtime.onConnect listner s=> ',  data);
    handler(data, port);
  });
  port.onMessageExternal.addListener((data: any): void => {
    console.log('on message external inside runtime on connect callback');
  });
  port.onDisconnect.addListener((): void => console.log(`Disconnected from ${port.name}`));
});

function handler<TMessageType extends MessageTypes> (payload: TransportRequestMessage<TMessageType>, port: chrome.runtime.Port): void {
  const sender: chrome.runtime.MessageSender | undefined = port.sender;
  const { id, message, request } = payload;

  console.log('*** background handler *** ');

  console.log('sender -> ', sender);
  console.log('message -> ', message);
  console.log('request -> ', request);

  switch(message) {
    case 'rpc.send':
      return wasmRunner.rpcProxySend(payload, port);
    case 'rpc.sendSubscribe':
      return wasmRunner.rpcProxySubscribe(payload, () => {console.log('TODO implement the rpc subscribe callback...')}, port);
    default:
      throw new Error(`Unable to handle message of type ${message}`);
  }
}

class WasmRunner {
  public _client: any = undefined;

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
    const client = start_client(ws());
    this._client = client;
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

    if (!this._client) {
      console.error('Client not yet started...');
    } else {
      console.log('RPC Send => ', JSON.stringify(payload));

      this._client.rpcSend(JSON.stringify(payload))
        .then((r: AnyJSON) => {
          console.log(`Got a response! ${JSON.stringify(r)}`);
          // TODO window.postMessage(r)
        });
    }
  };

  public rpcProxySubscribe = (transportRequestMessage: TransportRequestMessage<any>, cb: () => any, port: chrome.runtime.Port) => {
    console.log('trying to rpc proxy subscribe...');

    if (!this._client) {
      return;
    }

    // client.rpcSubscribe('{"method":"chain_subscribeNewHead","params":[],"id":1,"jsonrpc":"2.0"}', (r: AnyJSON) =>
    //   console.log('[client] New chain head: ' + r)

    this._client.rpcSubscribe();
  };
}

const wasmRunner = new WasmRunner();