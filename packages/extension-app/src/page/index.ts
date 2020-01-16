// Copyright 2018-2020 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { TransportResponseMessage, TransportSubscriptionNotification, ResponseMessage } from '../types';

interface Handler {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  resolve: (data: any) => void;
  reject: (error: Error) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  subscriber?: (data: any) => void;
}

type Handlers = Record<string, Handler>;

const handlers: Handlers = {};

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
    handler.resolve(data.response);
  }
}

function handleNotification (data: TransportSubscriptionNotification): void {
  console.log('handle Notification -> ', data);
  // subscriptionNotificationHandler.emit('message', data);
}

// setup a response listener (events created by the loader for extension responses)
window.addEventListener('message', ({ data, source }): void => {
  console.log('window got a message page.ts -> ', data, source);
  // only allow messages from our window, by the loader
  if (source !== window || data.origin !== 'content') {
    return;
  }

  if (data.id) {
    handleResponse(data);
  } else {
    handleNotification(data);
  }
});