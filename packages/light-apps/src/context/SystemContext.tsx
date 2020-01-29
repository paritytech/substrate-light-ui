// Copyright 2018-2020 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import Rpc from '@polkadot/rpc-core';
import { WsProvider } from '@polkadot/rpc-provider';
import { ProviderInterface } from '@polkadot/rpc-provider/types';
import { Text, TypeRegistry } from '@polkadot/types';
import { BlockHash, ChainProperties, Header, Health } from '@polkadot/types/interfaces';
import { logger } from '@polkadot/util';
import React, { useEffect, useRef, useState } from 'react';
import { combineLatest, interval, merge } from 'rxjs';
import { filter, switchMap } from 'rxjs/operators';

import { providerConnected } from './util';

/**
 * System-wide meta-information about the chain (nothing from its state)
 */
export interface SystemContextType {
  chain: Text;
  genesisHash: BlockHash;
  header: Header;
  health: Health;
  isSystemReady: boolean;
  name: Text;
  properties: ChainProperties;
  version: Text;
}

const INIT_ERROR = new Error('Please wait for `isSystemReady` before fetching this property');

const l = logger('system-context');

export const SystemContext: React.Context<SystemContextType> = React.createContext({} as SystemContextType);

export interface SystemContextProviderProps {
  children?: React.ReactNode;
  provider: ProviderInterface;
}

export function SystemContextProvider(props: SystemContextProviderProps): React.ReactElement {
  const { children = null, provider } = props;
  const [state, setState] = useState<SystemContextType>({
    get chain(): never {
      throw INIT_ERROR;
    },
    get genesisHash(): never {
      throw INIT_ERROR;
    },
    get header(): never {
      throw INIT_ERROR;
    },
    get health(): never {
      throw INIT_ERROR;
    },
    isSystemReady: false,
    get name(): never {
      throw INIT_ERROR;
    },
    get properties(): never {
      throw INIT_ERROR;
    },
    get version(): never {
      throw INIT_ERROR;
    },
  });

  const registryRef = useRef(new TypeRegistry());
  const rpcRef = useRef(new Rpc(registryRef.current, provider));
  const rpc = rpcRef.current;

  useEffect(() => {
    // We want to fetch all the information again each time we reconnect. We
    // might be connecting to a different node, or the node might have changed
    // settings.
    const sub = providerConnected(provider)
      .pipe(
        filter(connected => !!connected),
        switchMap(() =>
          combineLatest([
            rpc.system.chain(),
            rpc.chain.getBlockHash(0),
            merge(
              rpc.chain.subscribeNewHeads(),
              // Header doesn't get updated when doing a major sync, so we also poll
              interval(2000).pipe(switchMap(() => rpc.chain.getHeader()))
            ),
            rpc.system.health(),
            rpc.system.name(),
            rpc.system.properties(),
            rpc.system.version(),
          ])
        )
      )
      .subscribe(([chain, genesisHash, header, health, name, properties, version]) => {
        l.log(
          `Rpc connected to chain "${chain}" with properties ${JSON.stringify(properties)} via ${
            // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
            // @ts-ignore WsProvider.endpoint is private, but we still use it
            // here, to have a nice log
            provider instanceof WsProvider ? provider.endpoint : provider.constructor.name
          }`
        );

        setState({
          isSystemReady: chain && genesisHash && header && health && name && properties && !!version,
          chain,
          genesisHash,
          header,
          health,
          // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
          // @ts-ignore Somehow, combineLatest cannot handle that many arguments
          name,
          properties,
          version,
        });
      });

    return (): void => sub.unsubscribe();
  }, [provider, rpc]);

  return <SystemContext.Provider value={state}>{children}</SystemContext.Provider>;
}
