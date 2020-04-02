// Copyright 2018-2020 @polkadot/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { PORT_EXTENSION } from '@polkadot/extension-base/defaults';
import { sendMessage } from '@polkadot/extension-base/page';
import extension from 'extensionizer';

import { detectEnvironment } from './env';

const env = detectEnvironment();

// The `sendMessage` function below use window.postMessage. On the popup
// extension, we redirect all window.postMessage to port.postMessage. This is
// basically simulating what content/index.js does.
if (env === 'POPUP_ENV') {
  const port = extension.runtime.connect({ name: PORT_EXTENSION });

  // send any messages from the extension back to the page
  port.onMessage.addListener((data): void => {
    window.postMessage({ ...data, origin: 'content' }, '*');
  });

  // all messages from the page, pass them to the extension
  window.addEventListener('message', ({ data, source }): void => {
    // only allow messages from our window, by the inject
    if (source !== window || data.origin !== 'page') {
      return;
    }

    port.postMessage(data);
  });
}

/**
 * Use `window.postMessage` in browser tab or Electron environments, or
 * `port.postMessage` in extension popup.
 */
export { sendMessage };
