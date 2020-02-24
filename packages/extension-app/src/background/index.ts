// Copyright 2018-2020 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { logger } from '@polkadot/util';
import { kusamaCc3 } from '@substrate/light';
import extensionizer from 'extensionizer';

import { KUSAMA_CC3_WASM, start } from './client';
import { handler, MessageRequest } from './messages';

const l = logger('background');

extensionizer.runtime.onConnect.addListener(
  (port: browser.runtime.Port): void => {
    // Listen to all messages on the extension port and handle appropriately
    function messageListener(response: object): void {
      handler(response as MessageRequest, port);
    }
    port.onMessage.addListener(messageListener);

    // Gracefully handle port disconnects
    function disconnectListener(): void {
      if (port.onMessage.hasListener(messageListener)) {
        port.onMessage.removeListener(messageListener);

        l.log(`Disconnected from ${JSON.stringify(port)}`);
      }

      if (port.onDisconnect.hasListener(disconnectListener)) {
        port.onDisconnect.removeListener(disconnectListener);
      }
    }
    port.onDisconnect.addListener(disconnectListener);
  }
);

// At the beginning, just run Kusama
start(kusamaCc3.fromUrl(KUSAMA_CC3_WASM));
