// Copyright 2018-2020 @polkadot/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import {
  MessageTypes,
  MessageTypesWithNoSubscriptions,
  MessageTypesWithNullRequest,
  MessageTypesWithSubscriptions,
  RequestTypes,
  ResponseTypes,
  SubscriptionMessageTypes,
} from '@polkadot/extension-base/background/types';
import { PORT_EXTENSION } from '@polkadot/extension-base/defaults';
import {
  Handlers,
  sendMessage as sendMessageFromTab,
} from '@polkadot/extension-base/page';
import extension from 'extensionizer';

import { detectEnvironment } from './env';

const env = detectEnvironment();

// These three module variables are only used if env is POPUP_ENV
const handlers: Handlers = {};
let idCounter = 0;
let port: browser.runtime.Port | undefined;

if (env === 'POPUP_ENV') {
  port = extension.runtime.connect({ name: PORT_EXTENSION });

  // setup a listener for messages, any incoming resolves the promise
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  port.onMessage.addListener((data: any): void => {
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
  });
}

function sendMessageFromPopup<TMessageType extends MessageTypesWithNullRequest>(
  message: TMessageType
): Promise<ResponseTypes[TMessageType]>;
function sendMessageFromPopup<
  TMessageType extends MessageTypesWithNoSubscriptions
>(
  message: TMessageType,
  request: RequestTypes[TMessageType]
): Promise<ResponseTypes[TMessageType]>;
function sendMessageFromPopup<
  TMessageType extends MessageTypesWithSubscriptions
>(
  message: TMessageType,
  request: RequestTypes[TMessageType],
  subscriber: (data: SubscriptionMessageTypes[TMessageType]) => void
): Promise<ResponseTypes[TMessageType]>;
function sendMessageFromPopup<TMessageType extends MessageTypes>(
  message: TMessageType,
  request?: RequestTypes[TMessageType],
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  subscriber?: (data: any) => void
): Promise<ResponseTypes[TMessageType]> {
  return new Promise((resolve, reject): void => {
    const id = `${Date.now()}.${++idCounter}`;

    handlers[id] = { resolve, reject, subscriber };

    if (!port) {
      throw new Error('Port is iniatialized in POPUP_ENV. qed.');
    }

    port.postMessage({ id, message, request: request || {} });
  });
}

/**
 * Use `window.postMessage` in browser tab or Electron environments, or
 * `port.postMessage` in extension popup.
 */
export const sendMessage =
  env === 'POPUP_ENV' ? sendMessageFromPopup : sendMessageFromTab;
