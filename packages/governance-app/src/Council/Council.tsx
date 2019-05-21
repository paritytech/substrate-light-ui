// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Grid, Header, Margin } from '@substrate/ui-components';
import React from 'react';
import { RouteComponentProps } from 'react-router-dom';

import { CouncilCandidates } from './CouncilCandidates';
import { CouncilMembers } from './CouncilMembers';
import { CouncilSummary } from './CouncilSummary';

interface IProps extends RouteComponentProps {}

export function Council (props: IProps) {

  return (
    <Grid>
      <Margin top />
      <CouncilSummary />
      <Grid.Column width='8' height='100%' overflow='auto'>
        <CouncilMembers />
      </Grid.Column>
      <Grid.Column width='8'>
        <Header>Council Candidates ({councilCandidates && councilCandidates.length})</Header>
        <CouncilCandidates />
      </Grid.Column>
    </Grid>
  );
}
