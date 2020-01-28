// Copyright 2018-2020 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import { Route, Switch } from 'react-router-dom';

import { AddAccount } from './AddAccount';
import { AccountsOverview } from './Overview';

export function Accounts(): React.ReactElement {
  return (
    <Switch>
      <Route exact path='/accounts' component={AccountsOverview} />
      <Route path='/accounts/add' component={AddAccount} />
    </Switch>
  );
}
