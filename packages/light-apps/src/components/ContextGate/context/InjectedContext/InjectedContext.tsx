// Copyright 2018-2020 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { web3Enable } from '@polkadot/extension-dapp';
import { logger } from '@polkadot/util';
import React, { useEffect, useState } from 'react';

import { detectEnvironment } from '../../../../util/env';
import { createSendMessageFromPopup } from '../../../../util/sendMessage';
import { Injected } from './Injected';

interface InjectedContext {
  injected?: Injected;
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
        const extensions = await web3Enable(originName);

        if (!extensions.length) {
          throw new Error('No extension found. Please install SLUI extension.');
        }

        // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
        // @ts-ignore We overwrote the Injected class, the typings are actually
        // correct.
        const injected: Injected = extensions[0];

        setInjected(injected);
      }
    }

    getSendMessage().catch(l.error);
  }, [originName]);

  return (
    <InjectedContext.Provider value={{ injected }}>
      {children}
    </InjectedContext.Provider>
  );
}
