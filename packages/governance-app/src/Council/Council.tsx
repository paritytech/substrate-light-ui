// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AccountId, BalanceOf, BlockNumber, Tuple, Vector, U32 } from '@polkadot/types';
import { AppContext } from '@substrate/ui-common';
import { AddressSummary, Card, Grid, Header, Margin, Stacked, StyledNavLink, SubHeader, FadedText } from '@substrate/ui-components';
import React, { useContext, useEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { combineLatest, Observable } from 'rxjs';
import { take } from 'rxjs/operators';

import { CouncilMembers } from './CouncilMembers';
import { CouncilSummary } from './CouncilSummary';

interface IProps extends RouteComponentProps {}

export function Council (props: IProps) {
  const { api } = useContext(AppContext);
  const [activeCouncil, setActiveCouncil] = useState();
  const [councilCandidates, setCouncilCandidates] = useState();
  const [desiredSeats, setDesiredSeats] = useState();
  const [termDuration, setTermDuration] = useState();
  const [voters, setVoters] = useState();
  const [votingBond, setVotingBond] = useState();
  const [votingPeriod, setVotingPeriod] = useState();

  useEffect(() => {
    const subscription = combineLatest([
      (api.query.council.activeCouncil() as unknown as Observable<Vector<Tuple>>),
      (api.query.council.candidates() as unknown as Observable<Vector<AccountId>>),
      (api.query.council.desiredSeats() as unknown as Observable<U32>),
      (api.query.council.termDuration() as unknown as Observable<BlockNumber>),
      (api.query.council.voters() as unknown as Observable<Vector<AccountId>>),
      (api.query.council.votingBond() as unknown as Observable<BalanceOf>),
      (api.query.council.votingPeriod() as unknown as Observable<BlockNumber>)
    ])
    .pipe(
      take(1)
    )
    .subscribe(([activeCouncil, councilCandidates, desiredSeats, termDuration, voters, votingBond, votingPeriod]) => {
      setActiveCouncil(activeCouncil);
      setCouncilCandidates(councilCandidates);
      setDesiredSeats(desiredSeats);
      setTermDuration(termDuration);
      setVoters(voters);
      setVotingBond(votingBond);
      setVotingPeriod(votingPeriod);
    });

    return () => subscription.unsubscribe();
  }, []);

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
      <Margin top />
      <CouncilSummary
        desiredSeats={desiredSeats}
        termDuration={termDuration}
        votersCount={voters && voters.length}
        votingBond={votingBond}
        votingPeriod={votingPeriod}
      />
      <Grid.Column width='8' height='100%' overflow='auto'>
        <Header>Active Council ({activeCouncil && activeCouncil.length}) </Header>
        <CouncilMembers activeCouncil={activeCouncil} />
      </Grid.Column>
      <Grid.Column width='8'>
        <Header>Council Candidates ({councilCandidates && councilCandidates.length})</Header>
        <ul>{renderCouncilCandidates()}</ul>
      </Grid.Column>
    </Grid>
  );
}
