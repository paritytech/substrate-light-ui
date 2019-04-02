// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import InputAddress from '@polkadot/ui-app/InputAddress';
import { Container, Grid, Header } from '@substrate/ui-components';
import React from 'react';
import { RouteComponentProps } from 'react-router-dom';

interface MatchParams {
  currentAccount: string;
}

interface Props extends RouteComponentProps<MatchParams> {
  basePath: string;
}

export class Transfer extends React.PureComponent<Props> {
  render () {
    const { match: { params: { currentAccount } } } = this.props;

    return (
      <Container>
        <Grid>
          <Grid.Row centered>
            <Header>Transfer Balance</Header>
          </Grid.Row>

          <Grid.Row>
            <Grid.Column width='5'>
              <InputAddress
                onChange={console.log}
                type='account'
                value={currentAccount}
              />
            </Grid.Column>
            <Grid.Column width='5'>
              <InputAddress
                onChange={console.log}
                type='account'
                value={currentAccount}
              />
            </Grid.Column>

          </Grid.Row>
        </Grid>;
      </Container>
    );
  }
}
