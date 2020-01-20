// Copyright 2018-2020 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

/// <reference types="chrome" />

import {
  MessageTypes,
  NullMessageTypes,
  PayloadTypes,
  ResponseMessage,
  ResponseTypes,
  TransportRequestMessage,
  TransportResponseMessage,
  TransportSubscriptionNotification
} from '@substrate/extension-app/src/types';

// @ts-ignore
import extension from 'extensionizer';
import { subscriptionNotificationHandler } from './PostMessageProvider';

const port = extension.runtime.connect('hbgnfgbgnplkgimgijglbfgmmeghbkbd', { name: 'SLUI' });

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
      origin: 'SLUI',
      request: request || (null as PayloadTypes[TMessageType]),
    };

    console.log(`(transportRequestMessage) -> ${JSON.stringify(transportRequestMessage)}`);

    port.postMessage(transportRequestMessage);
  });
}

function handleResponse<TResponseMessage extends ResponseMessage> (data: TransportResponseMessage<TResponseMessage>): void {
  const handler = handlers[data.id];

  if (!handler) {
    console.error(`Unknown response: ${JSON.stringify(data)}`);
    return;
  }

  if (!handler.subscriber) {
    delete handlers[data.id];
  }

  if (data.subscription) {
    (handler.subscriber as Function)(data.subscription);
  } else if (data.error) {
    handler.reject(new Error(data.error));
  } else {
    handler.resolve(data.result);
  }
}

const handleSubscriptionNotification = (data: TransportSubscriptionNotification) => {
  subscriptionNotificationHandler.emit('message', data);
}

port.onMessage.addListener((message: string) => {
  const data = JSON.parse(message);
  console.log('message handler data ==> ', data);
  if (data.id) {
    handleResponse(data);
  } else {
    console.log('data for notifications -> ', data);
    handleSubscriptionNotification(data as TransportSubscriptionNotification);
  }
});
