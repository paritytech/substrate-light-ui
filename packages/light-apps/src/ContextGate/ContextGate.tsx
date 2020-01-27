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
  TxQueueContextProvider,
} from '@substrate/context';
import { Loading } from '@substrate/ui-components';
import extensionizer from 'extensionizer';
import React from 'react';

import { HealthContextProvider } from './context/HealthContext';
import { HealthGate } from './HealthGate';
import { PostMessageProvider } from './postMessage';

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
  if (
    // https://stackoverflow.com/questions/7507277/detecting-if-code-is-being-run-as-a-chrome-extension
    (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.id) ||
    typeof browser !== 'undefined'
  ) {
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
    case EXTENSION_ENV: {
      // We use a PostMessageProvider to communicate directly with the
      // background script
      const port = extensionizer.runtime.connect();

      return new PostMessageProvider(port);
    }
    default:
      return process.env.NODE_ENV === 'development'
        ? // With http://localhost:3000, we deliberatelyuse a PostMessageProvider
          new PostMessageProvider('window')
        : // We fallback to the remote node provided by W3F
          new WsProvider('wss://kusama-rpc.polkadot.io/');
  }
}

const wsProvider = getProvider(detectEnvironment());

export function ContextGate(props: { children: React.ReactNode }): React.ReactElement {
  const { children } = props;

  // const wsProvider = new PostMessageProvider();

  return (
    <AlertsContextProvider>
      <TxQueueContextProvider>
        <HealthContextProvider provider={wsProvider}>
          <HealthGate>
            <ApiContextProvider loading={<Loading active>Initializing chain...</Loading>} provider={wsProvider}>
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
