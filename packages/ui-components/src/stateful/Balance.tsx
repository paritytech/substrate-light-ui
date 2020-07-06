// Copyright 2018-2020 @paritytech/Nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import {
  DeriveBalancesAll,
  DeriveStakingAccount,
} from '@polkadot/api-derive/types';
import ApiRx from '@polkadot/api/rx';
import React, { useEffect, useState } from 'react';
import { combineLatest, of } from 'rxjs';

import { BalanceDisplay, BalanceDisplayProps } from '../BalanceDisplay';

interface BalanceProps
  extends Pick<
    BalanceDisplayProps,
    Exclude<keyof BalanceDisplayProps, 'balance'>
  > {
  address: string;
  api: ApiRx;
  detailed?: boolean;
  orientation?: 'horizontal' | 'vertical';
}

export function Balance(props: BalanceProps): React.ReactElement {
  const {
    address,
    api,
    detailed = false,
    orientation = 'horizontal',
    ...rest
  } = props;
  const [allBalances, setAllBalances] = useState<DeriveBalancesAll>();
  const [allStaking, setAllStaking] = useState<DeriveStakingAccount>();

  useEffect(() => {
    const balanceSub = combineLatest([
      api.derive.balances.all(address),
      api.derive.staking.account(address),
    ]).subscribe(([allBalances, allStaking]) => {
      setAllBalances(allBalances);
      setAllStaking(allStaking);
    });

    return (): void => balanceSub.unsubscribe();
  }, [api, address]);

  const handleRedeem = (): void => {
    // FIXME We're not unsubscring here, we should
    // FIXME: Get number of numSlashingSpans from API https://github.com/paritytech/substrate-api-sidecar/blob/master/src/ApiHandler.ts#L477L499
    of(api.tx.staking.withdrawUnbonded(4)).subscribe();
  };

  return (
    <BalanceDisplay
      allBalances={allBalances}
      allStaking={allStaking}
      detailed={detailed}
      orientation={orientation}
      handleRedeem={handleRedeem}
      {...rest}
    />
  );
}
