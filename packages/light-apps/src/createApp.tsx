// Copyright 2017-2018 @polkadot/light-apps authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ProviderInterface } from '@polkadot/rpc-provider/types';
import { RpcRxInterface } from '@polkadot/rpc-rx/types';
import { ThemeProvider, theme } from '@polkadot/ui-components';
import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter } from 'react-router-dom';

type Props = {
  api?: RpcRxInterface,
  provider?: ProviderInterface,
  url?: string
};

export function createApp (App: React.ComponentType, { api, provider, url }: Props = {}, rootId: string = 'root'): void {
  const rootElement = document.getElementById(rootId);

  if (!rootElement) {
    throw new Error(`Unable to find element with id '${rootId}'`);
  }

  ReactDOM.render(
    <HashRouter>
      <ThemeProvider theme={theme}>
        <App />
      </ThemeProvider>
    </HashRouter>,
    rootElement
  );
}
