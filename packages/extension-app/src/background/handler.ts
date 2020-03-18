// Copyright 2019-2020 @polkadot/extension authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { assert } from '@polkadot/util';

import Extension from '../polkadotjs/background/handlers/Extension';
import State from '../polkadotjs/background/handlers/State';
import Tabs from '../polkadotjs/background/handlers/Tabs';
import {
  MessageTypes,
  TransportRequestMessage,
} from '../polkadotjs/background/types';
import { PORT_EXTENSION } from '../polkadotjs/defaults';
import { providerList } from './clients';

const state = new State(providerList);
const extension = new Extension(state);
const tabs = new Tabs(state);

export function handler<TMessageType extends MessageTypes>(
  { id, message, request }: TransportRequestMessage<TMessageType>,
  port: chrome.runtime.Port
): void {
  const isExtension = port.name === PORT_EXTENSION;
  const sender = port.sender as chrome.runtime.MessageSender;
  const from = isExtension
    ? 'extension'
    : (sender.tab && sender.tab.url) || sender.url || '<unknown>';
  const source = `${from}: ${id}: ${message}`;

  console.log(` [in] ${source}`); // :: ${JSON.stringify(request)}`);

  const promise = isExtension
    ? extension.handle(id, message, request, port)
    : tabs.handle(id, message, request, from, port);

  promise
    .then((response): void => {
      console.log(`[out] ${source}`); // :: ${JSON.stringify(response)}`);

      // between the start and the end of the promise, the user may have closed
      // the tab, in which case port will be undefined
      assert(port, `Port has been disconnected`);

      port.postMessage({ id, response });
    })
    .catch((error): void => {
      console.log(`[err] ${source}:: ${error.message}`);

      // only send message back to port if it's still connected
      if (port) {
        port.postMessage({ id, error: error.message });
      }
    });
}
