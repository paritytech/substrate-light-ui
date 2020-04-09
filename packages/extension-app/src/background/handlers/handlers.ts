// Copyright 2018-2020 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import Popup from '@polkadot/extension-base/background/handlers/Extension';
import Tabs from '@polkadot/extension-base/background/handlers/Tabs';
import {
  MessageTypes,
  TransportRequestMessage,
} from '@polkadot/extension-base/background/types';
import { PORT_EXTENSION } from '@polkadot/extension-base/defaults';
import { assert } from '@polkadot/util';

import { providerList } from '../clients';
import { State } from './State';

const state = new State(providerList);
const popup = new Popup(state);
const tabs = new Tabs(state);

/**
 * Handle messages from tabs and popup.
 */
export function handlers<TMessageType extends MessageTypes>(
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

  // Here is a bit of a hack. SLUI has a different handling logic then polkadot
  // extension. So we decide which one to use here: first use Tab, then
  // Extension.
  const promise = tabs
    .handle(id, message, request, from, port)
    .catch((error) => {
      if (error.message.startsWith('Unable to handle message of type')) {
        return popup.handle(id, message, request, port);
      }

      throw error;
    });

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
