// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Card } from '@substrate/ui-components';
import React from 'react';
import { Redirect, Route, RouteComponentProps, Switch } from 'react-router-dom';

import { Bond } from './Bond';
import { Setup } from './Setup';

interface MatchParams {
  currentAccount?: string;
}

interface Props extends RouteComponentProps<MatchParams> {}

export function StakingOptions (props: Props) {
  return (
    <Card height='100%'>
      <Card.Content>
        <Switch>
          <Route path='/manageAccounts/:currentAccount/staking/setup' component={Setup} />
          <Route path='/manageAccounts/:currentAccount/staking/bond' component={Bond} />
          <Redirect from='/manageAccounts/:currentAccount/staking/' to='/manageAccounts/:currentAccount/staking/setup' />
        </Switch>
      </Card.Content>
    </Card>
  );
}
