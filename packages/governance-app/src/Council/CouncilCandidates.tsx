// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Vec } from '@polkadot/types';
import { AccountId } from '@polkadot/types/interfaces';
import { AppContext } from '@substrate/ui-common';
import { FadedText, Header, Stacked } from '@substrate/ui-components';
import React, { useContext, useEffect, useState } from 'react';

export function CouncilCandidates () {
  const { api } = useContext(AppContext);
  const [councilCandidates, setCouncilCandidates] = useState();

  useEffect(() => {

    const subscription = api.query.elections.candidates<Vec<AccountId>>()
      .subscribe((councilCandidates) => {
        setCouncilCandidates(councilCandidates);
      });

    return () => subscription.unsubscribe();
  }, []);

  if (councilCandidates && councilCandidates.length) {
    return (
      <React.Fragment>
        <Header>Council Candidates ({councilCandidates && councilCandidates.length})</Header>
        {
          councilCandidates.map((accountId: AccountId) => {
            return (
              <li>{accountId} is a candidate</li>
            );
          })
        }
      </React.Fragment>
    );
  } else {
    return (
      <Stacked>
        <FadedText>No Candidates Found</FadedText>
        <a
          href='https://wiki.polkadot.network/en/latest/polkadot/learn/governance/#council'
          rel='noopener noreferrer'
          target='_blank'
        >
          Click here to learn more about the Council
          </a>
      </Stacked>
    );
  }
}
