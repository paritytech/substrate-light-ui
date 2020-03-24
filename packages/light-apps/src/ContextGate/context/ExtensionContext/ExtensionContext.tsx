// Copyright 2018-2020 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { web3Enable, web3ListRpcProviders } from '@polkadot/extension-dapp';
import { ProviderMeta } from '@polkadot/extension-inject/types';
import { logger } from '@polkadot/util';
import React, { useEffect, useState } from 'react';

interface ExtensionContext {
  providers: Record<string, ProviderMeta>;
}

interface ExtensionContextProps {
  children: React.ReactElement;
  originName: string;
}

export const ExtensionContext = React.createContext({} as ExtensionContext);

const l = logger('extension-context');

export function ExtensionContextProvider(
  props: ExtensionContextProps
): React.ReactElement {
  const { children, originName } = props;
  const [providers, setProviders] = useState({});

  useEffect(() => {
    async function getProviders(): Promise<void> {
      const extensions = await web3Enable(originName);

      if (!extensions.length) {
        throw new Error('No extension found. Please install SLUI extension.');
      }

      const providerList = await web3ListRpcProviders(originName);

      providerList && setProviders(providerList);
    }

    getProviders().catch(l.error);
  }, [originName]);

  return (
    <ExtensionContext.Provider value={{ providers }}>
      {children}
    </ExtensionContext.Provider>
  );
}
