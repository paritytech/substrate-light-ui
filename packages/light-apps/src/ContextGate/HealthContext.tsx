// Copyright 2018-2020 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import Rpc from '@polkadot/rpc-core';
import { ProviderInterface } from '@polkadot/rpc-provider/types';
import { TypeRegistry } from '@polkadot/types';
import { Header, Health } from '@polkadot/types/interfaces';
import React, { useEffect, useRef, useState } from 'react';
import { interval } from 'rxjs';
import { switchMap } from 'rxjs/operators';

export interface HealthContextType {
  header?: Header;
  health?: Health;
}

export const HealthContext: React.Context<HealthContextType> = React.createContext({} as HealthContextType);

export interface HealthContextProviderProps {
  children?: React.ReactNode;
  provider: ProviderInterface;
}

export function HealthContextProvider(props: HealthContextProviderProps): React.ReactElement {
  const { children = null, provider } = props;
  const [health, setHealth] = useState<Health | undefined>(undefined);
  const [header, setHeader] = useState<Header | undefined>(undefined);

  const registryRef = useRef(new TypeRegistry());
  const rpcRef = useRef(new Rpc(registryRef.current, provider));
  const rpc = rpcRef.current;

  useEffect(() => {
    rpc.system.health().subscribe(setHealth);

    // Don't use rpc.chain.subsribeNewHead, because that header doesn't get
    // updated when doing a major sync
    interval(2000)
      .pipe(switchMap(() => rpc.chain.getHeader()))
      .subscribe(setHeader);
  }, [rpc]);

  return <HealthContext.Provider value={{ header, health }}>{children}</HealthContext.Provider>;
}
