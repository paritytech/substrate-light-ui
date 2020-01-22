// Copyright 2018-2020 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import {
  MessageRpcSendResponse,
  MessageTypes,
  NullMessageTypes,
  PayloadTypes,
  ResponseTypes,
  TransportRequestMessage,
  TransportResponseMessage,
  TransportSubscriptionNotification,
} from '../../../extension-app/src/types';
import { subscriptionNotificationHandler } from './PostMessageProvider';

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
    const id = ++idCounter;

    handlers[id] = { resolve, reject, subscriber };

    const transportRequestMessage: TransportRequestMessage<TMessageType> = {
      id,
      message,
      origin: 'PostMessageProvider',
      request: request || null,
    };

    console.log(`(window.postMessage) -> ${JSON.stringify(transportRequestMessage)}`);

    window.postMessage(transportRequestMessage, '*');
  });
}

export function handleResponse<TResponseMessage extends MessageRpcSendResponse>(
  data: TransportResponseMessage<TResponseMessage>
): void {
  const handler = handlers[data.id];

  if (!handler) {
    console.error(`Unknown response: ${JSON.stringify(data)}`);
    return;
  }

  if (!handler.subscriber) {
    delete handlers[data.id];
  }

  console.log('handleResponse() -> ', data);

  if (data.subscription) {
    console.log('data was subscription!');
    (handler.subscriber as Function)(data.subscription);
  } else if (data.error) {
    handler.reject(new Error(data.error));
  } else {
    handler.resolve(data.result);
  }
}

export const handleSubscriptionNotification = (data: TransportSubscriptionNotification) => {
  subscriptionNotificationHandler.emit('message', data);
};
