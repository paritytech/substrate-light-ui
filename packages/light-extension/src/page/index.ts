// Copyright 2019-2020 @polkadot/extension authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { handleResponse, sendMessage } from '@polkadot/extension-base/page';
import { injectExtension } from '@polkadot/extension-inject';

// FIXME Should probably export this in a separate package, because right now
// it's out of the root of this package.
import { Injected } from '../../../light-apps/src/components/context/InjectedContext/Injected';

async function enable(origin: string): Promise<Injected> {
  await sendMessage('pub(authorize.tab)', { origin });

  return new Injected(sendMessage);
}

// setup a response listener (events created by the loader for extension responses)
window.addEventListener('message', ({ data, source }): void => {
  // only allow messages from our window, by the loader
  if (source !== window || data?.origin !== 'content') {
    return;
  }

  if (data.id) {
    handleResponse(data);
  } else {
    console.error('Missing id for response.');
  }
});

injectExtension(enable, {
  name: 'slui',
  version: process.env.PKG_VERSION as string,
});
