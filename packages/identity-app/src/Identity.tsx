// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Container, Grid } from '@polkadot/ui-components';

import React from 'react';

import { AddressBook } from './AddressBook';
import { SavedAccounts } from './SavedAccounts';
import { Wallet } from './Wallet';

export class Identity extends React.PureComponent {
  render () {
    return (
      <Container>
        <Grid columns={3}>
          <Grid.Row>
            <Grid.Column> <Wallet /> </Grid.Column>
            <Grid.Column> <AddressBook /> </Grid.Column>
            <Grid.Column> <SavedAccounts /> </Grid.Column>
          </Grid.Row>
        </Grid>
      </Container>
    );
  }
}
