// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Balance as BalanceType } from '@polkadot/types';
import { AppContext } from '@substrate/ui-common';
import React, { useContext, useEffect, useState } from 'react';
import { Observable, of } from 'rxjs';

import { BalanceDisplay, BalanceDisplayProps } from '../BalanceDisplay';

interface BalanceProps extends Pick<BalanceDisplayProps, Exclude<keyof BalanceDisplayProps, 'balance'>> {
  address?: string;
}

const ZERO_BALANCE = new BalanceType(0);

export function Balance (props: BalanceProps) {
  const { address, ...rest } = props;
  const { api, system: { properties } } = useContext(AppContext);
  const [balance, setBalance] = useState<BalanceType>(ZERO_BALANCE);
  useEffect(() => {
    const balance$ = address
      ? (api.query.balances.freeBalance(address) as Observable<BalanceType>)
      : of(ZERO_BALANCE);

    const balanceSub = balance$.subscribe(setBalance);

    return () => balanceSub.unsubscribe();
  }, [api, address]);

  return <BalanceDisplay balance={balance} tokenSymbol={properties.tokenSymbol} {...rest} />;
}
