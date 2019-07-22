// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DerivedStaking } from '@polkadot/api-derive/types';
import { AccountId, Option } from '@polkadot/types';
import { AppContext } from '@substrate/ui-common/src';
import React, { useContext, useState, useReducer } from 'react';
import { Subscription, Observable } from 'rxjs';

interface Props {
  children: React.ReactNode;
}

type DerivedStakingMap = {
  accountId: AccountId,
  derivedStaking: DerivedStaking
};

type DerivedStakingMapArray = DerivedStakingMap[];

export interface IStakingContext {
  derivedStakingMapArray: DerivedStakingMapArray;
  fetchStakingInfo: (account: AccountId) => void;
  fetchSessionValidators: () => void;
}



  // FIXME: cache validators accountIds in context while showing: refreshing....last queried 4 minutes ago.

/*
  [
    accountId: DerivedStaking
  ]
*/
export const StakingContext: React.Context<IStakingContext> = React.createContext({} as IStakingContext);

// (api.derive.staking.controllers() as unknown as Observable<any>),
// (api.query.staking.recentlyOffline() as unknown as Observable<any>),
// (api.query.session.validators() as unknown as Observable<AccountId[]>)

// search if key exists in derivedStakingMapArray. Can't sort by address so best we can do is O(N) which is fine, this list shouldn't exceed length 100 or so.
const stakingMapReducer = (derivedStakingMapArray: DerivedStakingMapArray, action: any) => {
  switch (action.type) {
    case 'ADD':
      if (!derivedStakingMapArray) {
        return [{ accountId: action.accountId, derivedStaking: action.derivedStaking }];
      } else {
        return derivedStakingMapArray.map((derivedStakingMap) => {
        // if it exists, replace the record
          if (derivedStakingMap.accountId === action.accountId) {
            return [
              ...derivedStakingMapArray,
              {
                accountId: action.accountId,
                derivedStaking: action.derivedStaking
              }
            ];
          } else {
            return derivedStakingMapArray.concat({ accountId: action.accountId, derivedStaking: action.derivedStaking });
          }
        });
      }
    default:
      return;
  }
};

export function StakingContextProvider (props: Props) {
  const { api } = useContext(AppContext);
  const [allStashesAndControllers, setAllStashesAndControllers] = useState();
  const [derivedStakingMapArray, dispatch] = useReducer(stakingMapReducer, []);

  const fetchStakingInfo = (accountId: AccountId) => {
    const stakingSubscription: Subscription = (api.derive.staking.info(accountId) as Observable<DerivedStaking>)
      .subscribe((derivedStaking) => {
        dispatch({ accountId, derivedStaking });
        stakingSubscription.unsubscribe();
      });
  };

  const fetchSessionValidators = () => {
    const validatorSubscription: Subscription = (api.derive.staking.controllers() as unknown as Observable<[AccountId[], Option<AccountId>[]]>)
      .subscribe((allStashesAndControllers) => {
        setAllStashesAndControllers(allStashesAndControllers);

        validatorSubscription.unsubscribe();
      });
  };

  return (
    <StakingContext.Provider value={{ derivedStakingMapArray, fetchStakingInfo, fetchSessionValidators }}>
      {props.children}
    </StakingContext.Provider>
  );
}
