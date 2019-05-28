// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Balance as BalanceType, Option, StakingLedger } from '@polkadot/types';
import { AppContext } from '@substrate/ui-common';
import React, { useContext, useEffect, useState } from 'react';
import { combineLatest, from, merge, Observable, of, zip } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { BalanceDisplay, BalanceDisplayProps } from '../BalanceDisplay';
// import { DerivedBalances } from '@polkadot/api-derive/types';

interface BalanceProps extends Pick<BalanceDisplayProps, Exclude<keyof BalanceDisplayProps, 'balance'>> {
  address?: string;
  detailed?: boolean;
}

const ZERO_BALANCE = new BalanceType(0);

export function Balance (props: BalanceProps) {
  const { address, detailed = false, ...rest } = props;
  const { api, system: { properties } } = useContext(AppContext);
  const [freeBalance, setFreeBalance] = useState<BalanceType>(ZERO_BALANCE);
  const [reservedBalance, setReservedBalance] = useState();
  const [bondedBalance, setBondedBalance] = useState();

  useEffect(() => {
    let balanceSub = of(ZERO_BALANCE).subscribe(setFreeBalance);
    // By Default, Only Show the Free Balance
    if (!detailed) {
      balanceSub = (api.query.balances.freeBalance(address) as Observable<BalanceType>)
        .subscribe(setFreeBalance);
    } else {
      // If Specified, Also Show More Detailed Balances
      balanceSub = combineLatest([
        api.query.balances.freeBalance(address) as Observable<BalanceType>,
        api.query.balances.reservedBalance(address) as Observable<BalanceType>,
        api.query.staking.bonded(address) as Observable<Option<any>>,
        api.query.staking.ledger(address) as Observable<Option<StakingLedger>>
      ])
      .pipe(
        switchMap(([freeBalance, reservedBalance, bonded, ledger]) => {
          // const b = bonded.unwrapOr(null);
          const l = ledger.unwrapOr(null);

          const bondedBalance = l ? l.active : ZERO_BALANCE;

          return zip(from([freeBalance, reservedBalance, bondedBalance]));
        })
      )
      .subscribe(([freeBalance, reservedBalance, bondedBalance]) => {
        console.log('reserved -> ', reservedBalance);
        console.log('bonded -> ', bondedBalance);
        debugger;
        setFreeBalance(freeBalance);
        setReservedBalance(reservedBalance);
        setBondedBalance(bondedBalance);
      });
    }

    return () => balanceSub.unsubscribe();
  }, [api, address]);

  return (
    <BalanceDisplay
      bondedBalance={bondedBalance}
      freeBalance={freeBalance}
      reservedBalance={reservedBalance}
      lockedBalance={ZERO_BALANCE}
      tokenSymbol={properties.tokenSymbol}
      {...rest} />
  );
}
