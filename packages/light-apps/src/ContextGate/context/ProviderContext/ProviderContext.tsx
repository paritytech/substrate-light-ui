// Copyright 2018-2020 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { WsProvider } from '@polkadot/api';
import { ProviderInterface } from '@polkadot/rpc-provider/types';
import React, { useEffect, useState } from 'react';

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
   * Current provider JSON.
   */
  providerJSON: ProviderJSON | undefined;
  /**
   * Set a new provider.
   */
  setProviderJSON(provider: ProviderJSON): void;
}

export const ProviderContext: React.Context<ProviderContextType> = React.createContext(
  {} as ProviderContextType
);

export interface ProviderContextProviderProps {
  children?: React.ReactElement;
}

/**
 * From the JSON data of a provider, instantiate an actual provider.
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

const defaultProvider = {
  payload: 'wss://kusama-rpc.polkadot.io',
  type: 'WsProvider',
} as ProviderJSON;

export function ProviderContextProvider(
  props: ProviderContextProviderProps
): React.ReactElement {
  const { children = null } = props;
  const [providerJSON, setProviderJSON] = useState<ProviderJSON>(
    defaultProvider
  );

  const provider = createProvider(providerJSON);

  useEffect(() => {
    if (providerJSON.type === 'PostMessageProvider') {
      (provider as PostMessageProvider).switch(providerJSON.payload);
    }
  }, [provider, providerJSON]);

  return (
    <ProviderContext.Provider
      value={{
        provider,
        providerJSON,
        setProviderJSON,
      }}
    >
      {children}
    </ProviderContext.Provider>
  );
}
