// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Option } from '@polkadot/types';
import { AccountId } from '@polkadot/types/interfaces';
import { DerivedFees, DerivedStaking } from '@polkadot/api-derive/types';
import { KeyringAddress } from '@polkadot/ui-keyring/types';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { take } from 'rxjs/operators';

import { AppContext } from './AppContext';
import { AccountDerivedStakingMap } from './types';

export const StakingContext = createContext({
  accountStakingMap: {} as AccountDerivedStakingMap,
  allControllers: [] as AccountId[],
  allStashes: [] as AccountId[],
  allStashesAndControllers: [[], []] as [AccountId[], Option<AccountId>[]],
  derivedBalanceFees: {} as DerivedFees,
  onlyBondedAccounts: {} as AccountDerivedStakingMap
});

interface Props {
  children: React.ReactNode;
}

export function StakingContextProvider (props: Props): React.ReactElement {
  const { children } = props;
  const { api, isReady, keyring } = useContext(AppContext);
  const [accountStakingMap, setAccountStakingMap] = useState<AccountDerivedStakingMap>({});
  const [onlyBondedAccounts, setOnlyBondedAccounts] = useState<AccountDerivedStakingMap>({});
  const [allStashesAndControllers, setAllStashesAndControllers] = useState();
  const [allStashes, setAllStashes] = useState<AccountId[]>([]);
  const [allControllers, setAllControllers] = useState<AccountId[]>([]);
  const [derivedBalanceFees, setDerivedBalanceFees] = useState<DerivedFees>({} as DerivedFees);

  // get derive.staking.info for each account in keyring
  useEffect(() => {
    if (!isReady) { return; }
    const accounts: KeyringAddress[] = keyring.getAccounts();
    accounts.map(({ address }: KeyringAddress) => {
      const subscription = api.derive.staking.info(address)
        .pipe(take(1))
        .subscribe((derivedStaking: DerivedStaking) => {
          const newAccountStakingMap = accountStakingMap;
          newAccountStakingMap[address] = derivedStaking;

          setAccountStakingMap(newAccountStakingMap);
          if (derivedStaking.stashId && derivedStaking.controllerId) {
            setOnlyBondedAccounts(newAccountStakingMap);
          }
        });

      return (): void => subscription.unsubscribe();
    });
  }, [accountStakingMap, api, isReady, keyring]);

  // get allStashesAndControllers
  useEffect(() => {
    if (!isReady) { return; }

    const controllersSub = api.derive.staking.controllers()
      .pipe(take(1))
      .subscribe((allStashesAndControllers) => {
        setAllStashesAndControllers(allStashesAndControllers);
        const allControllers = allStashesAndControllers[1].filter((optional: Option<AccountId>): boolean => optional.isSome)
          .map((accountId): AccountId => accountId.unwrap());
        const allStashes = allStashesAndControllers[0];

        setAllControllers(allControllers);
        setAllStashes(allStashes);
      });

    return (): void => controllersSub.unsubscribe();
  }, [api, isReady]);

  // derived fees
  useEffect(() => {
    if (!isReady) { return; }

    const feeSub = api.derive.balances.fees()
      .pipe(take(1))
      .subscribe(setDerivedBalanceFees);

    return (): void => feeSub.unsubscribe();
  }, [api, isReady]);

  return (
    <StakingContext.Provider value={{
      accountStakingMap: accountStakingMap,
      allControllers,
      allStashes,
      allStashesAndControllers,
      derivedBalanceFees,
      onlyBondedAccounts: onlyBondedAccounts
    }}>
      {children}
    </StakingContext.Provider>
  );
}
