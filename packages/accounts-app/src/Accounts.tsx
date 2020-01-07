// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

import { AccountOverviewDetailed, AccountsOverview } from './Overview';

export function Accounts(): React.ReactElement {
  return (
    <Switch>
      <Route path='/manageAccounts/:currentAccount/overview' component={AccountsOverview} />
      <Route path='/manageAccounts/:currentAccount/details' component={AccountOverviewDetailed} />
      <Redirect exact from='/manageAccounts/:currentAccount' to='/manageAccounts/:currentAccount/overview' />
    </Switch>
  );
}
