// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AccountId, Balance as BalanceType, Option } from '@polkadot/types';
import { AppContext } from '@substrate/ui-common';
import React, { useContext, useEffect, useState } from 'react';
import { combineLatest, Observable, of } from 'rxjs';
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
  const [votingBalance, setVotingBalance] = useState();
  const [lockedBalance, setLockedBalance] = useState();

  useEffect(() => {
    let balanceSub = of(ZERO_BALANCE).subscribe(setFreeBalance);
    // By Default Just Care About Free Balance
    if (!detailed) {
      balanceSub = (api.query.balances.freeBalance(address) as Observable<BalanceType>)
        .subscribe(setFreeBalance);
    } else { // If Specified, Also Subscribe to the rest
      balanceSub = combineLatest([
        api.query.balances.freeBalance(address) as Observable<BalanceType>,
        api.query.balances.reservedBalance(address) as Observable<BalanceType>,
        api.query.staking.bonded(address) as Observable<Option<AccountId>>,
        api.query.staking.ledger(address) as Observable<Option<AccountId>>
      ])
      .pipe(
        switchMap(([freeBalance, reservedBalance, bonded, ledger]) => {
          const b = bonded.unwrapOr(null);
          const l = ledger.unwrapOr(null);
          console.log(b, l);
          debugger;
        })
      )
      .subscribe(([freeBalance, reservedBalance, bondedBalance, lockedBalance]) => {
        setFreeBalance(freeBalance);
        setReservedBalance(reservedBalance);
        setBondedBalance(bondedBalance);
        setLockedBalance(lockedBalance);
      });
    }

    return () => balanceSub.unsubscribe();
  }, [api, address]);

  return (
    <BalanceDisplay
      freeBalance={freeBalance}
      reservedBalance={reservedBalance}
      lockedBalance={lockedBalance}
      tokenSymbol={properties.tokenSymbol}
      votingBalance={votingBalance}
      {...rest} />
  );
}
