// Copyright 2018-2020 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import {
  AlertsContextProvider,
  ApiContextProvider,
  HealthContextProvider,
  KeyringContextProvider,
  SystemContextProvider,
  TxQueueContextProvider,
} from '@substrate/context';
import React from 'react';

import { TopBar } from '../TopBar';
import { ProviderContextProvider } from './context/ProviderContext';
import { ApiGate, HealthGate, KeyringGate, SystemGate } from './gates';

export function ContextGate(props: {
  children: React.ReactElement;
}): React.ReactElement {
  const { children } = props;

  return (
    <ProviderContextProvider>
      <SystemContextProvider>
        <>
          <TopBar />
          <SystemGate>
            <KeyringContextProvider>
              <KeyringGate>
                <HealthContextProvider>
                  <HealthGate>
                    <ApiContextProvider>
                      <ApiGate>
                        <AlertsContextProvider>
                          <TxQueueContextProvider>
                            {children}{' '}
                          </TxQueueContextProvider>
                        </AlertsContextProvider>
                      </ApiGate>
                    </ApiContextProvider>
                  </HealthGate>
                </HealthContextProvider>
              </KeyringGate>
            </KeyringContextProvider>
          </SystemGate>
        </>
      </SystemContextProvider>
    </ProviderContextProvider>
  );
}
