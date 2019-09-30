// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DerivedBalances, DerivedStaking } from '@polkadot/api-derive/types';
import { AppContext } from '@substrate/ui-common';
import React, { useContext, useEffect, useState } from 'react';
import { combineLatest, of } from 'rxjs';

import { BalanceDisplay, BalanceDisplayProps } from '../BalanceDisplay';

interface BalanceProps extends Pick<BalanceDisplayProps, Exclude<keyof BalanceDisplayProps, 'balance'>> {
  address: string;
  detailed?: boolean;
}

export function Balance (props: BalanceProps) {
  const { address, detailed = false, ...rest } = props;
  const { api } = useContext(AppContext);
  const [allBalances, setAllBalances] = useState();
  const [allStaking, setAllStaking] = useState();

  useEffect(() => {
    let balanceSub = combineLatest([
      api.derive.balances.all<DerivedBalances>(address),
      api.derive.staking.info<DerivedStaking>(address)
    ]).subscribe(([allBalances, allStaking]) => {
      setAllBalances(allBalances);
      setAllStaking(allStaking);
    });

    return () => balanceSub.unsubscribe();
  }, [api, address]);

  const handleRedeem = async (address: string) => {
    of(api.tx.staking.withdrawUnbonded(address)).subscribe();
  };

  return (
    <BalanceDisplay
      allBalances={allBalances}
      allStaking={allStaking}
      detailed={detailed}
      handleRedeem={handleRedeem}
      {...rest} />
  );
}
