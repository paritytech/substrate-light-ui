// Copyright 2018-2020 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import {
  AlertsContextProvider,
  ApiContext,
  ApiContextProvider,
  ApiContextType,
  KeyringContextProvider,
  TxQueueContextProvider,
} from '@substrate/context';
import { Loading } from '@substrate/ui-components';
import React from 'react';

import PostMessageProvider from './PostMessageProvider';

export function ContextGate(props: { children: React.ReactNode }): React.ReactElement {
  const { children } = props;

  return (
    <AlertsContextProvider>
      <TxQueueContextProvider>
        <ApiContextProvider
          loading={<Loading active>Connecting to the node...</Loading>}
          provider={new PostMessageProvider()}
        >
          <ApiContext.Consumer>
            {({ api, isReady, system }: Partial<ApiContextType>): React.ReactElement | boolean | undefined => {
              console.log('api: ', api);
              console.log('api isReady: ', isReady);
              console.log('system: ', system);
              return (
                api &&
                isReady &&
                system && (
                  <KeyringContextProvider api={api} isReady={isReady} system={system}>
                    {children}
                  </KeyringContextProvider>
                )
              );
            }}
          </ApiContext.Consumer>
        </ApiContextProvider>
      </TxQueueContextProvider>
    </AlertsContextProvider>
  );
}
