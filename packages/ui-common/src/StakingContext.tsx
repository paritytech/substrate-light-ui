// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DerivedStaking } from '@polkadot/api-derive/types';
import { KeyringAddress } from '@polkadot/ui-keyring/types';
import React, { createContext, useContext, useEffect, useReducer } from 'react';
import { Subscription, Observable } from 'rxjs';
import { take } from 'rxjs/operators';

import { AppContext } from './AppContext';
import { AccountDerivedStakingMap } from './types';

export const StakingContext = createContext({
  accountStakingMap: {} as AccountDerivedStakingMap,
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

  useEffect(() => {
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

  return (
    <StakingContext.Provider value={{ accountStakingMap: state.accountStakingMap, onlyBondedAccounts: state.onlyBondedAccounts }}>
      {children}
    </StakingContext.Provider>
  );
}
