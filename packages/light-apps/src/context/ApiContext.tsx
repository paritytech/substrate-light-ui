// Copyright 2018-2020 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ApiRx } from '@polkadot/api';
import { WsProvider } from '@polkadot/rpc-provider';
import { ProviderInterface } from '@polkadot/rpc-provider/types';
import { logger } from '@polkadot/util';
import React, { useEffect, useRef, useState } from 'react';
import { combineLatest } from 'rxjs';
import { switchMap } from 'rxjs/operators';

interface State {
  isApiReady: boolean;
}

export interface ApiContextType extends State {
  api: ApiRx; // From @polkadot/api
}

const l = logger('api-context');

export const ApiContext: React.Context<ApiContextType> = React.createContext({} as ApiContextType);

export interface ApiContextProviderProps {
  children?: React.ReactNode;
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
    api.isReady
      .pipe(switchMap(() => combineLatest([api.rpc.system.chain(), api.rpc.system.properties()])))
      .subscribe(([chain, properties]) => {
        l.log(
          `Api connected to ${
            // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
            // @ts-ignore WsProvider.endpoint is private, but we still use it
            // here, to have a nice log
            provider instanceof WsProvider ? provider.endpoint : 'provider'
          }`
        );
        l.log(`Api ready, connected to chain "${chain}" with properties ${JSON.stringify(properties)}`);

        setState({ isApiReady: true });
      });
  }, [api, provider]);

  return <ApiContext.Provider value={{ api, isApiReady }}>{children}</ApiContext.Provider>;
}
