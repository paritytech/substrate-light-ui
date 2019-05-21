// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { BalanceOf, BlockNumber } from '@polkadot/types';
import { FadedText, Grid, SubHeader } from '@substrate/ui-components';
import React from 'react';

interface IProps {
  desiredSeats: number;
  termDuration: BlockNumber;
  votersCount: number;
  votingBond: BalanceOf;
  votingPeriod: BlockNumber;
}

export function CouncilSummary (props: IProps) {
  const { desiredSeats, termDuration, votersCount, votingBond, votingPeriod } = props;

  return (
    <Grid.Row centered>
      <Grid.Column width='3'>
        <SubHeader>Term Duration: </SubHeader>
        <FadedText>{termDuration && termDuration.toString()}</FadedText>
      </Grid.Column>
      <Grid.Column width='3'>
        <SubHeader>Desired Seats: </SubHeader>
        <FadedText>{desiredSeats && desiredSeats.toString()}</FadedText>
      </Grid.Column>
      <Grid.Column width='3'>
        <SubHeader>Voters: </SubHeader>
        <FadedText>{votersCount}</FadedText>
      </Grid.Column>
      <Grid.Column width='3'>
        <SubHeader>Voting Bond:</SubHeader>
        <FadedText>{votingBond && votingBond.toString()}</FadedText>
      </Grid.Column>
      <Grid.Column width='3'>
        <SubHeader>Voting Period:</SubHeader>
        <FadedText>{votingPeriod && votingPeriod.toString()}</FadedText>
      </Grid.Column>
    </Grid.Row>
  );
}
