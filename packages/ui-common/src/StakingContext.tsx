// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { KeyringAddress } from '@polkadot/ui-keyring/types';
import { AccountId, Option, StakingLedger } from '@polkadot/types';
import React, { createContext, useContext, useEffect, useReducer } from 'react';
import { Subscription, Observable } from 'rxjs';
import { first } from 'rxjs/operators';

import { AppContext } from './AppContext';
import { BondedAccounts } from './types';

const eligibleAccountsReducer = (state: BondedAccounts, action: any) => {
  switch (action.type) {
    case 'ADD_CONTROLLER':
      return {
        ...state,
        controllers: state.controllers.concat(action.controller)
      };
    case 'ADD_STASH':
      return {
        ...state,
        stashes: state.stashes.concat(action.stash)
      };
    default:
      return state;
  }
};

export const StakingContext = createContext({
  // bonded accounts are accounts that are eligible to nominate
  bondedAccounts: {
    controllers: [] as AccountId[],
    stashes: [] as StakingLedger[]
  }
});

interface Props {
  children: React.ReactNode;
}

export function StakingContextProvider (props: Props) {
  const { children } = props;
  const { api, isReady, keyring } = useContext(AppContext);
  const [bondedAccounts, dispatch] = useReducer(eligibleAccountsReducer, {
    controllers: [] as AccountId[],
    stashes: [] as StakingLedger[]
  } as BondedAccounts);

  // list only the accounts that are either bonded (controller) or bonding (stash)
  useEffect(() => {
    const accounts: KeyringAddress[] = keyring.getAccounts();
    accounts.map(({ address }: KeyringAddress) => {
      const multiSub: Subscription = (api.queryMulti([
        [api.query.staking.bonded, address], // try to map to controller
        [api.query.staking.ledger, address] // try to map to stash
      ]) as Observable<[Option<AccountId>, Option<StakingLedger>]>)
        .pipe(
          first()
        ).subscribe(([controllerId, stakingLedger]) => {
          controllerId.isSome ? dispatch({ type: 'ADD_CONTROLLER', controller: controllerId.unwrap() })
            : stakingLedger.isSome ? dispatch({ type: 'ADD_STASH', stash: stakingLedger.unwrap() })
              : dispatch({ type: 'DEFAULT' });
        });

      return () => multiSub.unsubscribe();
    });
  }, [api, isReady, keyring]);

  return (
    <StakingContext.Provider value={{ bondedAccounts }}>
      {children}
    </StakingContext.Provider>
  );
}
