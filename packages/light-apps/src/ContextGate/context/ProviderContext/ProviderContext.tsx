// Copyright 2018-2020 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { WsProvider } from '@polkadot/api';
import { ProviderInterface } from '@polkadot/rpc-provider/types';
import React, { useState } from 'react';

import { PostMessageProvider } from '../../../util';

/**
 * JSON-serializable data to instantiate a provider.
 */
export interface ProviderJSON {
  payload: string;
  type: 'WsProvider' | 'PostMessageProvider' | 'WasmProvider';
}

export interface ProviderContextType {
  /**
   * Current provider.
   */
  provider: ProviderInterface | undefined;
  /**
   * Set a new provider.
   */
  setProvider(provider: ProviderJSON): void;
}

export const ProviderContext: React.Context<ProviderContextType> = React.createContext(
  {} as ProviderContextType
);

export interface ProviderContextProviderProps {
  children?: React.ReactElement;
}

/**
 * From a JSON-data of a provider, instantiate an actual provider.
 *
 * @param input - The JSON data used to create a provider.
 */
function createProvider(input: ProviderJSON): ProviderInterface {
  switch (input.type) {
    case 'WsProvider': {
      return new WsProvider(input.payload);
    }
    case 'PostMessageProvider': {
      return new PostMessageProvider('window');
    }
  }

  throw new Error(
    `createProvider: unrecognized provider ${JSON.stringify(input)}`
  );
}

const defaultProvider = createProvider({
  payload: 'wss://kusama-rpc.polkadot.io',
  type: 'WsProvider',
});

export function ProviderContextProvider(
  props: ProviderContextProviderProps
): React.ReactElement {
  const { children = null } = props;
  const [provider, setProvider] = useState<ProviderInterface>(defaultProvider);

  return (
    <ProviderContext.Provider
      value={{
        provider,
        setProvider(input: ProviderJSON): void {
          setProvider(createProvider(input));
        },
      }}
    >
      {children}
    </ProviderContext.Provider>
  );
}
