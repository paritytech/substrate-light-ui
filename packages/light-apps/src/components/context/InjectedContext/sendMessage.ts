// Copyright 2018-2020 @polkadot/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import {
  MessageTypes,
  RequestTypes,
  ResponseTypes,
} from '@polkadot/extension-base/background/types';
import { PORT_EXTENSION } from '@polkadot/extension-base/defaults';
import { Handlers } from '@polkadot/extension-base/page';
import { SendRequest } from '@polkadot/extension-base/page/types';
import chrome from '@polkadot/extension-inject/chrome';

import { detectEnvironment } from '../../../util/env';

/**
 * Based on the environment, use `window.postMessage` or `port.PostMessage` for
 * message passing.
 *
 * @param env - The current environment.
 */
export function createSendMessageFromPopup(): SendRequest {
  if (detectEnvironment() !== 'POPUP_ENV') {
    throw new Error(
      'createSendMessageFromPopup can only be called from POPUP_ENV'
    );
  }

  const port = chrome.runtime.connect({ name: PORT_EXTENSION });
  const handlers: Handlers = {};
  let idCounter = 0;

  const sendMessageFromPopup = <TMessageType extends MessageTypes>(
    message: TMessageType,
    request?: RequestTypes[TMessageType],
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    subscriber?: (data: any) => void
  ): Promise<ResponseTypes[TMessageType]> => {
    return new Promise((resolve, reject): void => {
      const id = `${Date.now()}.${++idCounter}`;

      handlers[id] = { reject, resolve, subscriber };

      port.postMessage({ id, message, request: request || {} });
    });
  };

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

  return sendMessageFromPopup;
}
