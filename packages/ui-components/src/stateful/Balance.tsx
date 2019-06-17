// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Balance as BalanceType } from '@polkadot/types';
import { DerivedBalances } from '@polkadot/api-derive/types';
import { AppContext } from '@substrate/ui-common';
import React, { useContext, useEffect, useState } from 'react';
import { Observable, Subscription } from 'rxjs';

import { BalanceDisplay, BalanceDisplayProps } from '../BalanceDisplay';

interface BalanceProps extends Pick<BalanceDisplayProps, Exclude<keyof BalanceDisplayProps, 'balance'>> {
  address?: string;
  detailed?: boolean;
}

const ZERO_BALANCE = new BalanceType(0);

export function Balance (props: BalanceProps) {
  const { address, detailed = false, ...rest } = props;
  const { api, system: { properties } } = useContext(AppContext);
  const [allBalances, setAllBalances] = useState();
  const [freeBalance, setFreeBalance] = useState(ZERO_BALANCE);

  useEffect(() => {
    let balanceSub: Subscription;
    // By Default, Only Show the Free Balance
    if (!detailed) {
      balanceSub = (api.query.balances.freeBalance(address) as Observable<BalanceType>)
        .subscribe(setFreeBalance);
    } else {
      // If Specified, Also Show More Detailed Balances
      balanceSub = (api.derive.balances.all(address) as Observable<DerivedBalances>)
        .subscribe(setAllBalances);
    }
    return () => balanceSub.unsubscribe();
  }, [api, address]);

  return (
    allBalances
      ? <BalanceDisplay
          freeBalance={allBalances.freeBalance}
          nominatedBalance={allBalances.nominatedBalance}
          reservedBalance={allBalances.reservedBalance}
          tokenSymbol={properties.tokenSymbol}
          {...rest} />
      : <BalanceDisplay
          freeBalance={freeBalance}
          {...rest} />
  );
}
