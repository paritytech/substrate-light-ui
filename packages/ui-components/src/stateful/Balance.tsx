// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Balance as BalanceType } from '@polkadot/types';
import { AppContext } from '@substrate/ui-common';
import React, { useContext, useEffect, useState } from 'react';
import { Observable, of } from 'rxjs';

import { BalanceDisplay, BalanceDisplayProps } from '../BalanceDisplay';
import { DerivedBalances } from '@polkadot/api-derive/types';

interface BalanceProps extends Pick<BalanceDisplayProps, Exclude<keyof BalanceDisplayProps, 'balance'>> {
  address?: string;
  detailed?: boolean;
}

const ZERO_BALANCE = new BalanceType(0);

export function Balance (props: BalanceProps) {
  const { address, detailed = false, ...rest } = props;
  const { api, system: { properties } } = useContext(AppContext);
  const [freeBalance, setFreeBalance] = useState<BalanceType>(ZERO_BALANCE);
  const [reservedBalance, setReservedBalance] = useState<BalanceType>(ZERO_BALANCE);
  const [votingBalance, setVotingBalance] = useState<BalanceType>(ZERO_BALANCE);
  const [lockedBalance, setLockedBalance] = useState<BalanceType>(ZERO_BALANCE);

  useEffect(() => {
    let balanceSub = of(ZERO_BALANCE).subscribe(setFreeBalance);
    // By Default Just Care About Free Balance
    if (!detailed) {
      balanceSub = (api.query.balances.freeBalance(address) as Observable<BalanceType>)
        .subscribe(setFreeBalance);
    } else { // If Specified, Also Subscribe to the rest
      balanceSub =
        (api.derive.balances.all(address) as unknown as Observable<DerivedBalances>)
          .subscribe((derivedBalances) => {
            setFreeBalance(derivedBalances.freeBalance);
            setReservedBalance(derivedBalances.reservedBalance);
            setVotingBalance(derivedBalances.votingBalance);
            setLockedBalance(derivedBalances.stakingBalance);
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
