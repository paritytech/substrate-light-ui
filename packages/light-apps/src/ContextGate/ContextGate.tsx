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
import { HealthContextProvider } from './context/HealthContext';
import { HealthGate } from './HealthGate';

export function ContextGate(props: { children: React.ReactNode }): React.ReactElement {
  const { children } = props;

  const wsProvider = new PostMessageProvider();

  return (
    <AlertsContextProvider>
      <TxQueueContextProvider>
        <HealthContextProvider provider={wsProvider}>
          <HealthGate>
            <ApiContextProvider loading={<Loading active>Initializing chain...</Loading>} provider={wsProvider.clone()}>
              <ApiContext.Consumer>
                {({ api, isReady, system }: ApiContextType): React.ReactElement | null =>
                  api && isReady && system ? (
                    <KeyringContextProvider api={api} isReady={isReady} system={system}>
                      {children}
                    </KeyringContextProvider>
                  ) : null
                }
              </ApiContext.Consumer>
            </ApiContextProvider>
          </HealthGate>
        </HealthContextProvider>
      </TxQueueContextProvider>
    </AlertsContextProvider>
  );
}
