// Copyright 2018-2020 @paritytech/Nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { WsProvider } from '@polkadot/api';
import { ApiContextProvider } from '@substrate/context';
import React from 'react';

export const withApi = (
  storyFn: () => React.ReactElement
): React.ReactElement => {
  return (
    <ApiContextProvider
      provider={new WsProvider('wss://kusama-rpc.polkadot.io/')}
    >
      {storyFn()}
    </ApiContextProvider>
  );
};
