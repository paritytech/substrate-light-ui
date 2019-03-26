// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Container, Grid, Header } from '@substrate/ui-components';
import React from 'react';
import { Route, RouteComponentProps, Switch } from 'react-router-dom';

import { Saved } from './Saved';
import { SendBalance } from './SendBalance';
import { SentBalance } from './SentBalance';

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
            <Header> Transfer Balance </Header>
          </Grid.Row>

          <Grid.Row>
            <Grid.Column width='10'>
              <Route component={Saved} />
            </Grid.Column>

            <Grid.Column width='6'>
              <Switch>
                <Route exact path='/transfer/:currentAddress/sent' component={SentBalance} />
                <Route path='/transfer/:currentAddress' component={SendBalance} />
              </Switch>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Container>
    );
  }
}
