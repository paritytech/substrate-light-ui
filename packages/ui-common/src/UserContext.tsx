// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React, { useContext, useState, createContext, useEffect } from 'react';
import { AppContext } from '.';

export const UserContext = createContext({
  staking: DerivedStaking,
  currentAccount: undefined
});

interface Props {
  children: any;
}

// Provides context about the :currentAccount at various routes for all packages
export function UserContextProvider (props: Props) {
  const { api } = useContext(AppContext);
  const [currentAccount, setCurrentAccount] = useState();
  const [staking, setStaking] = useState();

  useEffect(() => {
    (api.derive.staking.info(currentAccount) as Observable<DerivedStaking>)
      .subscribe((stakingInfo: DerivedStaking) => {
        if (!stakingInfo) {
          return;
        }

        const { controllerId, nextSessionId, nominators, rewardDestination, stakers, stashId, stakingLedger, validatorPrefs } = stakingInfo;

        const isStashNominating = nominators && nominators.length !== 0;
        const isStashValidating = !!validatorPrefs && !validatorPrefs.isEmpty && !isStashNominating;

        const state = {
          controllerId: controllerId && controllerId.toString(),
          isStashNominating,
          isStashValidating,
          nominators,
          rewardDestination: rewardDestination && rewardDestination.toNumber(),
          sessionId: nextSessionId && nextSessionId.toString(),
          stashActive: stakingLedger ? formatBalance(stakingLedger.active) : formatBalance(new Balance(0)),
          stakers,
          stashId: stashId && stashId.toString(),
          stashTotal: stakingLedger ? formatBalance(stakingLedger.total) : formatBalance(new Balance(0))
        };

        setState(state);
      });
    return () => subscription.unsubscribe();
  }), [api, currentAccount];

  return (
    <UserContext.Provider value={{ currentAccount, staking }}>
      {props.children}
    </UserContext.Provider>
  );
}
