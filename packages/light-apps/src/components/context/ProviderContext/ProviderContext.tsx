// Copyright 2018-2020 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ProviderInterface } from '@polkadot/rpc-provider/types';
import { logger } from '@polkadot/util';
import React, { useEffect, useState } from 'react';

import { LazyProvider } from '../../TopBar/ChooseProvider/discover';

const l = logger('provider-context');

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

export function ProviderContextProvider(
  props: ProviderContextProviderProps
): React.ReactElement {
  const { children = null } = props;
  const [lazy, setLazyProvider] = useState<LazyProvider>();
  const [provider, setProvider] = useState<ProviderInterface>();

  useEffect(() => {
    // Stop the currently running provider
    if (provider) {
      provider.disconnect();
    }

    if (lazy) {
      l.log(`Starting provider ${lazy.id}`);
      lazy.start().then(setProvider).catch(l.error);
    }

    // If we unmount, disconnect our potential provider.
    return (): void => {
      if (provider?.isConnected()) {
        provider.disconnect();
      }
    };

    // We don't want `provider` in the deps
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
