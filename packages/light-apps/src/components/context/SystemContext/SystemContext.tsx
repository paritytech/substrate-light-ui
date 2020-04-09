// Copyright 2018-2020 @paritytech/Nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import Rpc from '@polkadot/rpc-core';
import { WsProvider } from '@polkadot/rpc-provider';
import { ProviderInterface } from '@polkadot/rpc-provider/types';
import { Text, TypeRegistry } from '@polkadot/types';
import {
  BlockHash,
  ChainProperties,
  Header,
  Health,
} from '@polkadot/types/interfaces';
import { Codec } from '@polkadot/types/types';
import { logger } from '@polkadot/util';
import { providerConnected } from '@substrate/context';
import React, { useEffect, useRef, useState } from 'react';
import { combineLatest, interval, merge, MonoTypeOperatorFunction } from 'rxjs';
import { distinctUntilChanged, filter, switchMap, take } from 'rxjs/operators';

/**
 * Like distinctUntilChanged, but for Codecs
 */
function distinctCodecChanged<T extends Codec>(): MonoTypeOperatorFunction<T> {
  return distinctUntilChanged<T>((x, y) => x.eq(y));
}

/**
 * System-wide meta-information about the chain (nothing from its state)
 */
export interface SystemContextType {
  chain?: Text;
  genesisHash?: BlockHash;
  header?: Header;
  health?: Health;
  isSystemReady?: boolean;
  name?: Text;
  properties?: ChainProperties;
  version?: Text;
}

const l = logger('system-context');

export const SystemContext: React.Context<SystemContextType> = React.createContext(
  {} as SystemContextType
);

export interface SystemContextProviderProps {
  children?: React.ReactElement;
  provider?: ProviderInterface;
}

export function SystemContextProvider(
  props: SystemContextProviderProps
): React.ReactElement {
  const { children = null, provider } = props;
  const [chain, setChain] = useState<Text>();
  const [genesisHash, setGenesisHash] = useState<BlockHash>();
  const [header, setHeader] = useState<Header>();
  const [health, setHealth] = useState<Health>();
  const [name, setName] = useState<Text>();
  const [properties, setProperties] = useState<ChainProperties>();
  const [version, setVersion] = useState<Text>();

  const registryRef = useRef(new TypeRegistry());
  const [rpc, setRpc] = useState<Rpc>();

  useEffect(() => {
    if (!provider) {
      return;
    }

    // Create a new RPC client each time we change provider
    setRpc(new Rpc(registryRef.current, provider));
  }, [provider]);

  useEffect(() => {
    if (!provider || !rpc) {
      return;
    }

    // We want to fetch all the information again each time we reconnect. We
    // might be connecting to a different node, or the node might have changed
    // settings.
    const sub = providerConnected(provider)
      .pipe(
        filter((connected) => !!connected),
        switchMap(() =>
          combineLatest([
            rpc.system.chain(),
            rpc.chain.getBlockHash(0),
            rpc.system.name(),
            rpc.system.properties(),
            rpc.system.version(),
          ])
        ),
        take(1)
      )
      .subscribe(([_chain, _genesisHash, _name, _properties, _version]) => {
        l.log(
          `Rpc connected to chain "${_chain}" with properties ${JSON.stringify(
            _properties
          )} via ${
            provider instanceof WsProvider
              ? // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
                // @ts-ignore WsProvider.endpoint is private, but we still use it
                // here, to have a nice log
                provider.endpoint
              : provider.constructor.name
          }`
        );

        setChain(_chain);
        setGenesisHash(_genesisHash);
        setName(_name);
        setProperties(_properties);
        setVersion(_version);
      });

    return (): void => sub.unsubscribe();
  }, [provider, rpc]);

  useEffect(() => {
    if (!provider || !rpc) {
      return;
    }

    const sub = providerConnected(provider)
      .pipe(
        filter((connected) => !!connected),
        switchMap(() =>
          combineLatest([
            merge(
              rpc.chain.subscribeNewHeads(),
              // Header doesn't get updated when doing a major sync, so we also poll
              interval(2000).pipe(switchMap(() => rpc.chain.getHeader()))
            ).pipe(distinctCodecChanged()),
            interval(2000).pipe(
              switchMap(() => rpc.system.health()),
              distinctCodecChanged()
            ),
          ])
        )
      )
      .subscribe(([_header, _health]) => {
        setHeader(_header);
        setHealth(_health);
      });

    return (): void => sub.unsubscribe();
  }, [provider, rpc]);

  return (
    <SystemContext.Provider
      value={{
        chain,
        genesisHash,
        header,
        health,
        isSystemReady: !!(
          chain &&
          genesisHash &&
          header &&
          health &&
          name &&
          properties &&
          version
        ),
        name,
        properties,
        version,
      }}
    >
      {children}
    </SystemContext.Provider>
  );
}
