// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AccountId, Tuple, Vector } from '@polkadot/types';
import { AppContext } from '@substrate/ui-common';
import { Grid, Header, Stacked, StyledNavLink, SubHeader, FadedText } from '@substrate/ui-components';
import React, { useContext, useEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { combineLatest, Observable } from 'rxjs';
import { take } from 'rxjs/operators';

interface IProps extends RouteComponentProps {}

export function Council (props: IProps) {
  const { api } = useContext(AppContext);
  const [activeCouncil, setActiveCouncil] = useState();
  const [councilCandidates, setCouncilCandidates] = useState();

  useEffect(() => {
    const subscription = combineLatest([
      (api.query.council.activeCouncil() as unknown as Observable<Vector<Tuple>>),
      (api.query.council.candidates() as unknown as Observable<Vector<AccountId>>)
    ])
    .pipe(
      take(1)
    )
    .subscribe(([activeCouncil, councilCandidates]) => {
      setActiveCouncil(activeCouncil);
      setCouncilCandidates(councilCandidates);
    });

    return () => subscription.unsubscribe();
  }, []);

  const renderCouncilMembers = () => {
    return activeCouncil && activeCouncil.map(([accountId, blockNumber]) => {
      return (
        <li>{accountId.toString()} is valid till {blockNumber.toString()}</li>
      );
    });
  };

  const renderCouncilCandidates = () => {
    if (councilCandidates && councilCandidates.length) {
      return councilCandidates.map((accountId: AccountId) => {
        return (
          <li>{accountId} is a candidate</li>
        );
      });
    } else {
      return (
        <Stacked>
          <FadedText>No Candidates Found</FadedText>
          <StyledNavLink to={'/#'}>Click here to learn more about the Council</StyledNavLink>
        </Stacked>
      );
    }
  };

  return (
    <Grid>
      <Grid.Column width='8'>
        <Header>Active Council</Header>
        <ul>{renderCouncilMembers()}</ul>
      </Grid.Column>
      <Grid.Column width='8'>
        <Header>Council Candidates</Header>
        <ul>{renderCouncilCandidates()}</ul>
      </Grid.Column>
    </Grid>
  );
}
