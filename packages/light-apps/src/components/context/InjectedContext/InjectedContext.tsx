// Copyright 2018-2020 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { InjectedWindowProvider } from '@polkadot/extension-inject/types';
import { logger } from '@polkadot/util';
import React, { useEffect, useState } from 'react';

import { detectEnvironment } from '../../../util/env';
import { Injected } from './Injected';
import { messaging } from './messaging';
import { createSendMessageFromPopup } from './sendMessage';

interface InjectedContext {
  injected?: Injected;
  messaging?: ReturnType<typeof messaging>;
}

interface InjectedContextProps {
  children: React.ReactElement;
  originName: string;
}

export const InjectedContext = React.createContext({} as InjectedContext);

const l = logger('extension-context');

export function InjectedContextProvider(
  props: InjectedContextProps
): React.ReactElement {
  const { children, originName } = props;
  const [injected, setInjected] = useState<Injected>();

  useEffect(() => {
    async function getSendMessage(): Promise<void> {
      if (detectEnvironment() === 'POPUP_ENV') {
        const injected = new Injected(createSendMessageFromPopup());

        setInjected(injected);
      } else {
        const injectedWeb3: Record<string, InjectedWindowProvider> =
          window.injectedWeb3 || {};

        // Connect to SLUI if it exists
        if (injectedWeb3.slui) {
          const injected = await injectedWeb3.slui.enable(originName);

          setInjected(injected as Injected);
        } else {
          l.warn('Please install SLUI extension for a better experience.');
        }
      }
    }

    getSendMessage().catch(l.error);
  }, [originName]);

  return (
    <InjectedContext.Provider
      value={{
        injected,
        messaging: injected && messaging(injected.sendMessage),
      }}
    >
      {children}
    </InjectedContext.Provider>
  );
}
