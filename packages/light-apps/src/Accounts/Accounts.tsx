// Copyright 2018-2020 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React, { useContext } from 'react';
import { Redirect, Route, RouteComponentProps, Switch } from 'react-router-dom';

import { AccountContext } from '../ContextGate/context';
import { AddAccount } from './AddAccount';
import { AccountsOverview } from './Overview';

type Props = RouteComponentProps;

export function Accounts(props: Props): React.ReactElement {
  const { location } = props;
  const { accounts } = useContext(AccountContext);

  // Redirect to Add Account page if we have no accounts
  if (
    !Object.keys(accounts).length &&
    !location.pathname.startsWith('/accounts/add')
  ) {
    return <Redirect to='/accounts/add' />;
  }

  return (
    <Switch>
      <Route exact path='/accounts' component={AccountsOverview} />
      <Route path='/accounts/add' component={AddAccount} />
    </Switch>
  );
}
