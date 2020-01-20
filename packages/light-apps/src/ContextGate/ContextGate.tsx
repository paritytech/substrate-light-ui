// Copyright 2018-2020 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import {
  AlertsContextProvider,
  ApiContext,
  ApiContextProvider,
  ApiContextType,
  KeyringContextProvider,
  StakingContextProvider,
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
              return (
                api &&
                isReady &&
                system && (
                  <StakingContextProvider>
                    <KeyringContextProvider api={api} isReady={isReady} system={system}>
                      {children}
                    </KeyringContextProvider>
                  </StakingContextProvider>
                )
              );
            }}
          </ApiContext.Consumer>
        </ApiContextProvider>
      </TxQueueContextProvider>
    </AlertsContextProvider>
  );
}
