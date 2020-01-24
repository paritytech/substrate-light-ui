// Copyright 2019-2020 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

/**
 * This file is only injected in http://localhost:3000
 */

import extensionizer from 'extensionizer';

// Connect to the extension
const port: browser.runtime.Port = extensionizer.runtime.connect();

// send any messages from the extension back to the page
port.onMessage.addListener((data): void => {
  window.postMessage(data, 'http://localhost:3000');
});

// all messages from the page, pass them to the extension
window.addEventListener('message', ({ data, source }): void => {
  // only allow messages from our window, by the inject
  if (source !== window || data.origin !== 'PostMessageProvider') {
    return;
  }

  port.postMessage(data);
});
