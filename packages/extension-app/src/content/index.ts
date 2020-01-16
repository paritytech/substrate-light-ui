// Copyright 2018-2020 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import extension from 'extensionizer';
console.log('i am here in content');

const port = extension.runtime.connect({ name: 'content' });

// send messages from @extension-app back to @light-apps
port.onMessage.addListener((data: any) => {
  console.log('port.onMessage() listenere...');
  window.postMessage({ ...data, origin: 'content' }, '*');
});

// @light-apps posts to window, this gets it and passes it to the extension runtime port.
window.addEventListener('message', ({ data, source }): void => {
  console.log('window.addEventListener()');
  console.log(data);

  if (source !== window || data.origin !== 'SLUI') {
    return;
  }

  port.postMessage(data); // data here is TransportRequestMessage<TMessageType>
});

// inject our data injector
const script = document.createElement('script');
script.src = extension.extension.getURL('page.js');
script.onload = (): void => {
  // remove the injecting tag when loaded
  if (script.parentNode) {
    script.parentNode.removeChild(script);
  }
};

(document.head || document.documentElement).appendChild(script);