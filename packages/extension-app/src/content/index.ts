// Copyright 2019-2020 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

/**
 * This file is only injected in http://localhost:3000
 */

// connect to the extension
const port = browser.runtime.connect();

// send any messages from the extension back to the page
port.onMessage.addListener((data): void => {
  console.log('BACKGROUND->CONTENT', data);

  window.postMessage(data, '*');
});

// all messages from the page, pass them to the extension
window.addEventListener('message', ({ data, source }): void => {
  // only allow messages from our window, by the inject
  if (source !== window || data.origin !== 'PostMessageProvider') {
    return;
  }

  console.log('CONTENT->BACKGROUND', data, source);

  port.postMessage(data);
});
