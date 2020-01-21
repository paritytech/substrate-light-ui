// Copyright 2018-2020 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { WsProvider } from '@polkadot/api';
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

import { HealthContextProvider } from './context/HealthContext';
import { HealthGate } from './HealthGate';

// FIXME Use PostMessageProvider once we have an extension
// https://github.com/paritytech/substrate-light-ui/issues/52
const wsProvider = new WsProvider('wss://kusama-rpc.polkadot.io');

export function ContextGate(props: { children: React.ReactNode }): React.ReactElement {
  const { children } = props;

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
