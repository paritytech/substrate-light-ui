// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Tuple, Vector } from '@polkadot/types';
import { AppContext } from '@substrate/ui-common';
import { AddressSummary, Card, FadedText, Header } from '@substrate/ui-components';
import React, { useContext, useEffect, useState } from 'react';
import { Observable } from 'rxjs';

export function CouncilMembers () {
  const { api } = useContext(AppContext);
  const [activeCouncil, setActiveCouncil] = useState();

  useEffect(() => {
    const subscription =
      (api.query.council.activeCouncil() as unknown as Observable<Vector<Tuple>>)
      .subscribe(([activeCouncil]) => {
        setActiveCouncil(activeCouncil);
      });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <React.Fragment>
      <Header>Active Council ({activeCouncil && activeCouncil.length}) </Header>
      {
        activeCouncil.map(([accountId, blockNumber]) => {
          return (
            <Card height='234px' key={accountId.toString()}>
              <Card.Content>
                <AddressSummary address={accountId.toString()} />
                <FadedText>Valid till: {blockNumber.toString()}</FadedText>
              </Card.Content>
            </Card>
          );
        })
      }
    </React.Fragment>
  );
}
