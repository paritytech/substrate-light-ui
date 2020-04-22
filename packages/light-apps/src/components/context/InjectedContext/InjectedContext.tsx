// Copyright 2018-2020 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { InjectedWindowProvider } from '@polkadot/extension-inject/types';
import { logger } from '@polkadot/util';
import React, { useCallback, useEffect, useState } from 'react';

import { detectEnvironment } from '../../../util/env';
import { Injected } from './Injected';
import { messaging } from './messaging';
import { createSendMessageFromPopup } from './sendMessage';

/**
 * Unique ID to identify our own extension.
 */
export const OWN_EXTENSION_NAME = 'slui';
/**
 * Unique ID to identify the official PolkadotJS extension.
 */
export const POLKADOTJS_EXTENSION_NAME = 'polkadot-js';
/**
 * Unique ID to identify our own origin.
 */
export const ORIGIN_NAME = 'slui';

interface InjectedContext {
  /**
   * Call this function when we want to enable an extension.
   */
  enable: (extensionName: string) => void;
  /**
   * All injected extensions.
   */
  injected: Record<string, Injected>;
  /**
   * Messaging only applies to our own extension.
   */
  messaging?: ReturnType<typeof messaging>;
}

interface InjectedContextProps {
  children: React.ReactElement;
}

const l = logger('extension-context');

export const InjectedContext = React.createContext({} as InjectedContext);

export function InjectedContextProvider(
  props: InjectedContextProps
): React.ReactElement {
  const { children } = props;
  const [injected, setInjected] = useState<Record<string, Injected>>({});

  const enable = useCallback(
    (extensionName: string) => {
      async function getSendMessage(): Promise<void> {
        if (
          detectEnvironment() === 'POPUP_ENV' &&
          extensionName === OWN_EXTENSION_NAME
        ) {
          const injected = new Injected(createSendMessageFromPopup());

          setInjected({ [OWN_EXTENSION_NAME]: injected });
        } else if (detectEnvironment() === 'TAB_ENV') {
          // If we're in a tab, we can detect other extensions.
          const injectedWeb3: Record<string, InjectedWindowProvider> =
            window.injectedWeb3 || {};

          // Connect to SLUI if it exists
          if (injectedWeb3[extensionName]) {
            const newInjected = await injectedWeb3[extensionName].enable(
              ORIGIN_NAME
            );

            l.log(`Connected to extension ${extensionName}`);

            setInjected({
              ...injected,
              [extensionName]: newInjected as Injected,
            });
          } else {
            l.warn('Please install SLUI extension for a better experience.');
          }
        }
      }

      getSendMessage().catch(l.error);
    },
    [injected]
  );

  // Connect to own extension only once, on startup.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => enable(OWN_EXTENSION_NAME), []);

  return (
    <InjectedContext.Provider
      value={{
        enable,
        injected,
        messaging:
          injected[OWN_EXTENSION_NAME] &&
          messaging(injected[OWN_EXTENSION_NAME].sendMessage),
      }}
    >
      {children}
    </InjectedContext.Provider>
  );
}
