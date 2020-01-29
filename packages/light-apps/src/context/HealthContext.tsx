// Copyright 2018-2020 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ProviderInterface } from '@polkadot/rpc-provider/types';
import { Header, Health } from '@polkadot/types/interfaces';
import React, { useContext, useEffect, useState } from 'react';

import { SystemContext } from './SystemContext';

/**
 * Period, in ms, after which we consider we're syncing
 */
const SYNCING_THRESHOLD = 2000;

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
function getNodeStatus(
  provider: ProviderInterface,
  header: Header | undefined,
  health: Health | undefined
): Omit<HealthContextType, 'isSyncing'> {
  let best = 0;
  let isNodeConnected = false;
  let hasPeers = false;

  if (provider.isConnected() && health && header) {
    isNodeConnected = true;
    best = header.number.toNumber();

    if (health.peers.gten(1)) {
      hasPeers = true;
    }
  }

  return {
    best,
    hasPeers,
    isNodeConnected,
  };
}

export const HealthContext: React.Context<HealthContextType> = React.createContext({} as HealthContextType);

export interface HealthContextProviderProps {
  children?: React.ReactElement;
  provider: ProviderInterface;
}

// Track if we we're already syncing
let wasSyncing = true;

export function HealthContextProvider(props: HealthContextProviderProps): React.ReactElement {
  const { children = null, provider } = props;
  const { header, health } = useContext(SystemContext);
  const [isSyncing, setIsSyncing] = useState(true);

  // We wait for 2 seconds, and if we've been syncing for 2 seconds, then we
  // set isSyncing to true
  useEffect(() => {
    let timer: number | undefined;

    if (!wasSyncing && health.isSyncing.eq(true)) {
      wasSyncing = true;
      timer = setTimeout(() => {
        setIsSyncing(true);
      }, SYNCING_THRESHOLD);
    } else if (wasSyncing && health.isSyncing.eq(false)) {
      wasSyncing = false;
      setIsSyncing(false);
      timer && clearTimeout(timer);
    }

    return (): void => {
      timer && clearTimeout(timer);
    };
  }, [health, setIsSyncing]);

  const status = {
    ...getNodeStatus(provider, header, health),
    isSyncing,
  };

  return <HealthContext.Provider value={status}>{children}</HealthContext.Provider>;
}
