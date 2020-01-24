// Copyright 2019-2020 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

/**
 * This content script is only injected in http://localhost:3000
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

// Copied from https://github.com/polkadot-js/extension/blob/ce37e2a8f2c537b7711f501c06fd355de7d5c95c/packages/extension/src/content.ts#L27-L38

// inject our data injector
const script = document.createElement('script');

script.src = extensionizer.extension.getURL('page.js');
script.onload = (): void => {
  // remove the injecting tag when loaded
  if (script.parentNode) {
    script.parentNode.removeChild(script);
  }
};

(document.head || document.documentElement).appendChild(script);
