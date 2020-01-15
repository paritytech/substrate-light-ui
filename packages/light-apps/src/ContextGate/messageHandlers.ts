// Copyright 2018-2020 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import {
  MessageTypes,
  NullMessageTypes,
  PayloadTypes,
  ResponseTypes,
  TransportRequestMessage,
} from '@substrate/extension-app/src/types';

interface Handler {
  resolve: (data: any) => void;
  reject: (error: Error) => void;
  subscriber?: (data: any) => void;
}

type Handlers = Record<string, Handler>;

const handlers: Handlers = {};
let idCounter = 0;

// a generic message sender that creates an event, returning a promise that will
// resolve once the event is resolved (by the response listener just below this)
export function sendMessage<TMessageType extends NullMessageTypes>(
  message: TMessageType
): Promise<ResponseTypes[TMessageType]>;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function sendMessage<TMessageType extends MessageTypes>(
  message: TMessageType,
  request: PayloadTypes[TMessageType],
  subscriber?: (data: any) => void
): Promise<ResponseTypes[TMessageType]>;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function sendMessage<TMessageType extends MessageTypes>(
  message: TMessageType,
  request?: PayloadTypes[TMessageType],
  subscriber?: (data: any) => void
): Promise<ResponseTypes[TMessageType]> {
  return new Promise((resolve, reject): void => {
    const id = `${Date.now()}.${++idCounter}`;

    handlers[id] = { resolve, reject, subscriber };

    const transportRequestMessage: TransportRequestMessage<TMessageType> = {
      id,
      message,
      origin: 'page',
      request: request || (null as PayloadTypes[TMessageType]),
    };

    console.log(`(sendRquest) sending a message..... ${JSON.stringify(transportRequestMessage)}`);

    // @substrate/extension-app is listening for this message
    window.postMessage(transportRequestMessage, '*');
  });
}

// FIXME add handled for responses
window.addEventListener('message', ({ data, source }): void => {
  if (data.id) {
    // handleResponse(data);
    console.log('@light-apps needs to handle response with this data: ', data);
  }
})