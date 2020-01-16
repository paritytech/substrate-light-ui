// Copyright 2018-2020 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { WsProvider } from '@polkadot/api';
import { ProviderInterface } from '@polkadot/rpc-provider/types';
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

const ELECTRON_ENV = 'ELECTRON_ENV';
const EXTENSION_ENV = 'EXTENSION_ENV';
const BROWSER_ENV = 'BROWSER_ENV';
type Env = typeof ELECTRON_ENV | typeof EXTENSION_ENV | typeof BROWSER_ENV;

/**
 * Detect whether light-apps is running in Electron, in an Extension popup, or
 * as a regular browser webpage.
 */
function detectEnvironment(): Env {
  // Detect ELECTRON_ENV
  // https://github.com/electron/electron/issues/2288#issuecomment-337858978
  const userAgent = navigator.userAgent.toLowerCase();
  if (userAgent.includes(' electron/')) {
    return ELECTRON_ENV;
  }

  // Detect EXTENSION_ENV
  // Chrome extensions have the global `chrome` object, Firefox have the
  // `browser` one (WebExtension one).
  if (typeof chrome !== 'undefined' || typeof browser !== 'undefined') {
    return EXTENSION_ENV;
  }

  return BROWSER_ENV;
}

/**
 * Depending on the environment, the provider we use is different.
 */
function getProvider(env: Env): ProviderInterface {
  switch (env) {
    case ELECTRON_ENV:
      // We use the local light node embedded in the electron app
      return new WsProvider('ws://127.0.0.1:9944');
    case EXTENSION_ENV:
      // We use a PostMessageProvider to communicate directly with the
      // background script
      // FIXME Use PostMessageProvider once we have an extension
      // https://github.com/paritytech/substrate-light-ui/issues/52
      return new WsProvider('wss://kusama-rpc.polkadot.io/');
    default:
      // We fallback to the remote node provided by W3F
      return new WsProvider('wss://kusama-rpc.polkadot.io/');
  }
}

const wsProvider = getProvider(detectEnvironment());

export function ContextGate(props: { children: React.ReactNode }): React.ReactElement {
  const { children } = props;

  return (
    <AlertsContextProvider>
      <TxQueueContextProvider>
        <ApiContextProvider loading={<Loading active>Connecting to the node...</Loading>} provider={wsProvider}>
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
