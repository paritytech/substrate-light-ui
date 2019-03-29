// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import addresses$ from '@polkadot/ui-keyring/observable/addresses';
import accounts$ from '@polkadot/ui-keyring/observable/accounts';
import { Container, Grid, Header } from '@substrate/ui-components';
import React from 'react';
import { RouteComponentProps } from 'react-router-dom';

import { AddressDropdown } from './AddressDropdown';

interface MatchParams {
  currentAddress: string;
}

interface Props extends RouteComponentProps<MatchParams> {
  basePath: string;
}

export class Transfer extends React.PureComponent<Props> {
  render () {
    return (
      <Container>
        <Grid>
          <Grid.Row centered>
            <Header>Transfer Balance</Header>
          </Grid.Row>

          <Grid.Row>
            <AddressDropdown />
          </Grid.Row>
        </Grid>
      </Container>
    );
  }
}
