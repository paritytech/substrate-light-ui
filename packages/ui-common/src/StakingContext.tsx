// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AccountId, Option } from '@polkadot/types';
import { DerivedFees, DerivedStaking } from '@polkadot/api-derive/types';
import { KeyringAddress } from '@polkadot/ui-keyring/types';
import React, { createContext, useContext, useEffect, useReducer, useState } from 'react';
import { Subscription, Observable } from 'rxjs';
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

const accountStakingReducer = (state: any, action: any) => {
  switch (action.type) {
    case 'NEW_DERIVED_STAKING':
      let newState = state;
      newState.accountStakingMap[action.derivedStaking.accountId] = action.derivedStaking;
      if (action.derivedStaking.stashId && action.derivedStaking.controllerId) {
        newState.onlyBondedAccounts[action.derivedStaking.accountId] = action.derivedStaking;
      }
      return newState;
    default:
      throw new Error('Something went wrong with getting DerivedStaking information...');
  }
};

export function StakingContextProvider (props: Props) {
  const { children } = props;
  const { api, isReady, keyring } = useContext(AppContext);
  const [state, dispatch] = useReducer(accountStakingReducer, {
    accountStakingMap: {},
    onlyBondedAccounts: {}
  });
  const [allStashesAndControllers, setAllStashesAndControllers] = useState();
  const [allStashes, setAllStashes] = useState<AccountId[]>([]);
  const [allControllers, setAllControllers] = useState<AccountId[]>([]);
  const [derivedBalanceFees, setDerivedBalanceFees] = useState<DerivedFees>({} as DerivedFees);

  // get derive.staking.info for each account in keyring
  useEffect(() => {
    if (!isReady) { return; }
    const accounts: KeyringAddress[] = keyring.getAccounts();
    accounts.map(({ address }: KeyringAddress) => {
      const subscription: Subscription = (api.derive.staking.info(address) as Observable<DerivedStaking>)
        .pipe(take(1))
        .subscribe((derivedStaking: DerivedStaking) => {
          dispatch({ type: 'NEW_DERIVED_STAKING', derivedStaking });
        });
      return () => subscription.unsubscribe();
    });
  }, [api, isReady, keyring]);

  // get allStashesAndControllers
  useEffect(() => {
    if (!isReady) { return; }
    const controllersSub: Subscription = (api.derive.staking.controllers() as Observable<[AccountId[], Option<AccountId>[]]>)
      .pipe(take(1))
      .subscribe((allStashesAndControllers: [AccountId[], Option<AccountId>[]]) => {
        setAllStashesAndControllers(allStashesAndControllers);
        const allControllers = allStashesAndControllers[1].filter((optional: Option<AccountId>): boolean => optional.isSome)
          .map((accountId: Option<AccountId>): AccountId => accountId.unwrap());
        const allStashes = allStashesAndControllers[0];

        setAllControllers(allControllers);
        setAllStashes(allStashes);
      });

    return () => controllersSub.unsubscribe();
  }, [api, isReady]);

  useEffect(() => {
    if (!isReady) { return; }
    const feeSub: Subscription = (api.derive.balances.fees() as Observable<DerivedFees>)
      .pipe(take(1))
      .subscribe(setDerivedBalanceFees);
    return () => feeSub.unsubscribe();
  }, [api, isReady]);

  return (
    <StakingContext.Provider value={{
      accountStakingMap: state.accountStakingMap,
      allControllers,
      allStashes,
      allStashesAndControllers,
      derivedBalanceFees,
      onlyBondedAccounts: state.onlyBondedAccounts
    }}>
      {children}
    </StakingContext.Provider>
  );
}
