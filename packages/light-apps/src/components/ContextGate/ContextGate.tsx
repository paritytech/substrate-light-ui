// Copyright 2018-2020 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import {
  AlertsContextProvider,
  ApiRxContextProvider,
  HealthContextProvider,
  SystemContextProvider,
} from '@substrate/context';
import React from 'react';

import {
  AccountContextProvider,
  InjectedContext,
  InjectedContextProvider,
  ProviderContext,
  ProviderContextProvider,
} from '../context';
import { TopBar } from '../TopBar';
import { ApiGate, HealthGate, SystemGate } from './gates';

export function ContextGate(props: {
  children: React.ReactElement;
}): React.ReactElement {
  const { children } = props;

  return (
    <InjectedContextProvider>
      <InjectedContext.Consumer>
        {({ injected }): React.ReactElement => (
          <ProviderContextProvider>
            <ProviderContext.Consumer>
              {({ provider }): React.ReactElement | null => (
                <SystemContextProvider provider={provider}>
                  <HealthContextProvider provider={provider}>
                    <>
                      <TopBar />
                      <SystemGate>
                        <AccountContextProvider injected={injected}>
                          <HealthGate>
                            <>
                              {/* The HealthGate asserts that `provider` is defined. */}
                              {/* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */}
                              <ApiRxContextProvider provider={provider!}>
                                <ApiGate>
                                  <AlertsContextProvider>
                                    {children}
                                  </AlertsContextProvider>
                                </ApiGate>
                              </ApiRxContextProvider>
                            </>
                          </HealthGate>
                        </AccountContextProvider>
                      </SystemGate>
                    </>
                  </HealthContextProvider>
                </SystemContextProvider>
              )}
            </ProviderContext.Consumer>
          </ProviderContextProvider>
        )}
      </InjectedContext.Consumer>
    </InjectedContextProvider>
  );
}
