// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { u32 } from '@polkadot/types';
import { Balance, BlockNumber, VoteIndex } from '@polkadot/types/interfaces';
import { AppContext } from '@substrate/ui-common';
import { FadedText, Grid, SubHeader } from '@substrate/ui-components';
import React, { useContext, useEffect, useState } from 'react';
import { combineLatest } from 'rxjs';
import { take } from 'rxjs/operators';

export function CouncilSummary () {
  const { api } = useContext(AppContext);

  const carryCount = api.consts.elections.carryCount as u32;
  const desiredSeats = api.consts.elections.desiredSeats as u32;
  const votingBond = api.consts.elections.votingBond as Balance;
  const votingPeriod = api.consts.elections.votingPeriod as BlockNumber;

  const [termDuration, setTermDuration] = useState<BlockNumber>();
  const [voteCount, setVoteCount] = useState<VoteIndex>();

  useEffect(() => {
    const subscription = combineLatest([
      api.query.council.termDuration<BlockNumber>(),
      api.query.council.voteCount<VoteIndex>()
    ]).pipe(take(1))
      .subscribe(([termDuration, voteCount]) => {
        setTermDuration(termDuration);
        setVoteCount(voteCount);
      });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <React.Fragment>
      <Grid.Row centered>
        <Grid.Column width='4'>
          <SubHeader>Term Duration: </SubHeader>
          <FadedText>{termDuration && termDuration.toString()} Blocks</FadedText>
        </Grid.Column>
        <Grid.Column width='4'>
          <SubHeader>Desired Seats: </SubHeader>
          <FadedText>{desiredSeats && desiredSeats.toString()} Seats</FadedText>
        </Grid.Column>
        <Grid.Column width='4'>
          <SubHeader>Carry Count: </SubHeader>
          <FadedText>{carryCount && carryCount.toString()} Seats</FadedText>
        </Grid.Column>
        <Grid.Column width='4'>
          <SubHeader>Votes Count: </SubHeader>
          <FadedText>{voteCount && voteCount.toString()} Votes </FadedText>
        </Grid.Column>
      </Grid.Row>
      <Grid.Row>
        <Grid.Column width='4'>
          <SubHeader>Voting Bond:</SubHeader>
          <FadedText>{votingBond && votingBond.toString()}</FadedText>
        </Grid.Column>
        <Grid.Column width='4'>
          <SubHeader>Voting Period:</SubHeader>
          <FadedText>{votingPeriod && votingPeriod.toString()}</FadedText>
        </Grid.Column>
      </Grid.Row>
    </React.Fragment>
  );
}
