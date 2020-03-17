// Copyright 2018-2020 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { WsProvider } from '@polkadot/api';
import { ProviderInterface } from '@polkadot/rpc-provider/types';
import React, { useEffect, useState } from 'react';

/**
 * Interface describing a Provider, lazily loaded.
 */
export interface LazyProvider {
  description: string;
  id: string;
  lazy: () => ProviderInterface;
  network: string;
  type: 'WsProvider' | 'PostMessageProvider' | 'WasmProvider';
}

export interface ProviderContextType {
  /**
   * Current lazy provider.
   */
  lazy: LazyProvider | undefined;
  /**
   * Current provider.
   */
  provider: ProviderInterface | undefined;
  /**
   * Set a new provider.
   */
  setLazyProvider(provider: LazyProvider): void;
}

export const ProviderContext: React.Context<ProviderContextType> = React.createContext(
  {} as ProviderContextType
);

export interface ProviderContextProviderProps {
  children?: React.ReactElement;
}

export const DEFAULT_PROVIDER: LazyProvider = {
  description: 'Remote node hosted by W3F',
  id: 'kusama-WsProvider',
  lazy: () => new WsProvider('wss://kusama-rpc.polkadot.io'),
  network: 'kusama',
  type: 'WsProvider',
};

export function ProviderContextProvider(
  props: ProviderContextProviderProps
): React.ReactElement {
  const { children = null } = props;
  const [lazy, setLazyProvider] = useState<LazyProvider>(DEFAULT_PROVIDER);
  const [provider, setProvider] = useState(DEFAULT_PROVIDER.lazy());

  useEffect(() => {
    setProvider(lazy.lazy());
  }, [lazy]);

  return (
    <ProviderContext.Provider
      value={{
        provider,
        lazy,
        setLazyProvider,
      }}
    >
      {children}
    </ProviderContext.Provider>
  );
}
