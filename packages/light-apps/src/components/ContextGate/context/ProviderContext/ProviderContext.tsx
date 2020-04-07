// Copyright 2018-2020 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { WsProvider } from '@polkadot/api';
import { ProviderMeta } from '@polkadot/extension-inject/types';
import { ProviderInterface } from '@polkadot/rpc-provider/types';
import { logger } from '@polkadot/util';
import React, { useEffect, useState } from 'react';

const l = logger('provider-context');

/**
 * Interface describing a Provider, lazily loaded.
 */
export interface LazyProvider extends ProviderMeta {
  description: string;
  id: string;
  start: () => Promise<ProviderInterface>;
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

/**
 * These fallback providers connect to a centralized remote RPC node.
 */
export const FALLBACK_PROVIDERS: LazyProvider[] = [
  {
    description: 'Remote node hosted by W3F',
    id: 'westend-WsProvider',
    network: 'westend',
    node: 'light',
    source: 'slui',
    start: (): Promise<ProviderInterface> =>
      Promise.resolve(new WsProvider('wss://westend-rpc.polkadot.io')),
    transport: 'WsProvider',
  },
  {
    description: 'Remote node hosted by W3F',
    id: 'kusama-WsProvider',
    network: 'kusama',
    node: 'light',
    source: 'slui',
    start: (): Promise<ProviderInterface> =>
      Promise.resolve(new WsProvider('wss://kusama-rpc.polkadot.io')),
    transport: 'WsProvider',
  },
];

export const DEFAULT_PROVIDER = FALLBACK_PROVIDERS[0];

export function ProviderContextProvider(
  props: ProviderContextProviderProps
): React.ReactElement {
  const { children = null } = props;
  const [lazy, setLazyProvider] = useState<LazyProvider>(DEFAULT_PROVIDER);
  const [provider, setProvider] = useState<ProviderInterface>(
    new WsProvider('wss://kusama-rpc.polkadot.io')
  );

  useEffect(() => {
    lazy.start().then(setProvider).catch(l.error);
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
