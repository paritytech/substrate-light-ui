// Copyright 2018-2020 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AnyFunction, Callback } from '@polkadot/types/types';

export interface PostMessageSource {
  onMessage: (callback: Callback<object>) => void;
  postMessage: (message: object) => void;
  source: 'window' | browser.runtime.Port;
  unsubscribe: (listener: AnyFunction) => void;
}

/**
 * A `port.postMessage` postMessage interface
 */
export function portPostMessage(port: browser.runtime.Port): PostMessageSource {
  return {
    onMessage: (callback: Callback<object>): AnyFunction => {
      const listener = (response: object): void => {
        callback(response);
      };

      port.onMessage.addListener(listener);

      return listener;
    },
    postMessage: (message: object): void => port.postMessage(message),
    source: port,
    unsubscribe: (listener: AnyFunction): void => {
      port.onMessage.removeListener(listener);
    },
  };
}

/**
 * A `window.postMessage` postMessage interface
 */
export function windowPostMessage(): PostMessageSource {
  return {
    onMessage: (callback: Callback<object>): AnyFunction => {
      const listener = (event: MessageEvent): void => {
        callback(event.data);
      };

      window.addEventListener('message', listener);

      return listener;
    },
    postMessage: (message: object): void => window.postMessage(message, '*'),
    source: 'window',
    unsubscribe: (listener: AnyFunction): void => {
      window.removeEventListener('message', listener);
    },
  };
}
