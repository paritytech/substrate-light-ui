// Copyright 2018-2020 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ApiRx } from '@polkadot/api';
import { ProviderInterface } from '@polkadot/rpc-provider/types';
import { logger } from '@polkadot/util';
import React, { useEffect, useRef, useState } from 'react';

interface State {
  isApiReady: boolean;
}

export interface ApiContextType extends State {
  api: ApiRx; // From @polkadot/api
}

const l = logger('api-context');

export const ApiContext: React.Context<ApiContextType> = React.createContext({} as ApiContextType);

export interface ApiContextProviderProps {
  children?: React.ReactElement;
  provider: ProviderInterface;
}

export function ApiContextProvider(props: ApiContextProviderProps): React.ReactElement {
  const { children = null, provider } = props;
  const [state, setState] = useState<State>({ isApiReady: false });
  const { isApiReady } = state;

  const apiRef = useRef(new ApiRx({ provider }));
  const api = apiRef.current;

  useEffect(() => {
    // We want to fetch all the information again each time we reconnect. We
    // might be connecting to a different node, or the node might have changed
    // settings.
    api.isReady.subscribe(() => {
      l.log(`Api ready, app is ready to use`);

      setState({ isApiReady: true });
    });
  }, [api, provider]);

  return <ApiContext.Provider value={{ api, isApiReady }}>{children}</ApiContext.Provider>;
}
