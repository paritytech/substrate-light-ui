// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Container, Header } from '@substrate/ui-components';
import React from 'react';
import { Route, RouteComponentProps, Switch, Redirect } from 'react-router-dom';

import { SendBalance } from './SendBalance';
import { SentBalance } from './SentBalance';

interface MatchParams {
  currentAccount: string;
}

interface Props extends RouteComponentProps<MatchParams> {}

export class Transfer extends React.PureComponent<Props> {
  render () {
    return (
      <Container>
        <Header>Transfer Balance</Header>

        <Switch>
          <Route component={SentBalance} path='/transfer/:currentAccount/sent'></Route>
          <Route exact path='/transfer/:currentAccount/' render={({ match: { params: { currentAccount } } }) => (
              <Redirect to={`/transfer/${currentAccount}/${currentAccount}`} />
          )} />
          <Route component={SendBalance} path='/transfer/:currentAccount/:recipientAddress'></Route>
          <Route component={SendBalance}></Route>
        </Switch>
      </Container>
    );
  }
}
