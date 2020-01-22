// Copyright 2018-2020 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import Rpc from '@polkadot/rpc-core';
import { ProviderInterface } from '@polkadot/rpc-provider/types';
import { TypeRegistry } from '@polkadot/types';
import { Header, Health } from '@polkadot/types/interfaces';
import React, { useEffect, useRef, useState } from 'react';
import { combineLatest, interval, merge, Subscription } from 'rxjs';
import { map, startWith, switchMap } from 'rxjs/operators';

export interface HealthContextType {
  /**
   * Best block
   */
  best: number;
  /**
   * Node has peers
   */
  hasPeers: boolean;
  /**
   * Able to connect to the node
   */
  isNodeConnected: boolean;
  /**
   * Node is syncing (major or minor)
   */
  isSyncing: boolean;
}

/**
 * Get the health status of the node
 *
 * @param header - The latest header of the light node
 * @param health - The health of the light node
 */
function getNodeStatus(header: Header | undefined, health: Health | undefined): HealthContextType {
  let best = 0;
  let isNodeConnected = false;
  let hasPeers = false;
  let isSyncing = false;

  if (health && header) {
    isNodeConnected = true;
    best = header.number.toNumber();

    if (health.peers.gten(1)) {
      hasPeers = true;
    }

    if (health.isSyncing.isTrue) {
      isSyncing = true;
    }
  }

  return {
    best,
    hasPeers,
    isNodeConnected,
    isSyncing,
  };
}

export const HealthContext: React.Context<HealthContextType> = React.createContext({} as HealthContextType);

export interface HealthContextProviderProps {
  children?: React.ReactNode;
  provider: ProviderInterface;
}

export function HealthContextProvider(props: HealthContextProviderProps): React.ReactElement {
  const { children = null, provider } = props;
  const [status, setStatus] = useState<HealthContextType>({
    best: 0,
    hasPeers: false,
    isNodeConnected: false,
    isSyncing: false,
  });

  const registryRef = useRef(new TypeRegistry());
  const rpcRef = useRef(new Rpc(registryRef.current, provider));
  const rpc = rpcRef.current;

  useEffect(() => {
    let sub: Subscription | undefined;

    rpc.provider.on('connected', () => {
      sub = combineLatest([
        rpc.system.health(),
        merge(
          rpc.chain.subscribeNewHeads(),
          // Header doesn't get updated when doing a major sync, so we also poll
          interval(2000).pipe(switchMap(() => rpc.chain.getHeader()))
        ),
      ])
        .pipe(
          startWith([undefined, undefined]),
          map(([health, header]) => getNodeStatus(header, health))
        )
        .subscribe(setStatus);
    });

    return (): void => sub && sub.unsubscribe();
  }, [rpc]);

  return <HealthContext.Provider value={status}>{children}</HealthContext.Provider>;
}
