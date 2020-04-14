// Copyright 2018-2020 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import ApiRx from '@polkadot/api/rx';
import { ProviderInterface } from '@polkadot/rpc-provider/types';
import { logger } from '@polkadot/util';
import React, { useEffect, useState } from 'react';

export interface ApiContextType {
  api: ApiRx;
  isApiReady: boolean;
}

const l = logger('api-context');

export const ApiContext: React.Context<ApiContextType> = React.createContext(
  {} as ApiContextType
);

export interface ApiContextProviderProps {
  children?: React.ReactElement;
  provider: ProviderInterface;
}

export function ApiContextProvider(
  props: ApiContextProviderProps
): React.ReactElement {
  const { children, provider } = props;
  const [api, setApi] = useState<ApiRx>(new ApiRx({ provider }));
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // We want to fetch all the information again each time we reconnect. We
    // might be connecting to a different node, or the node might have changed
    // settings.
    setApi(new ApiRx({ provider }));
    setIsReady(false);
  }, [provider]);

  useEffect(() => {
    // We want to fetch all the information again each time we reconnect. We
    // might be connecting to a different node, or the node might have changed
    // settings.
    const subscription = api.isReady.subscribe(() => {
      l.log(`Api ready, app is ready to use`);

      setIsReady(true);
    });

    return (): void => subscription.unsubscribe();
  }, [api]);

  return (
    <ApiContext.Provider value={{ api, isApiReady: isReady }}>
      {children}
    </ApiContext.Provider>
  );
}
