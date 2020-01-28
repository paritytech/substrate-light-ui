// Copyright 2018-2020 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Accounts, AddAccount, ManageAddresses } from '@substrate/accounts-app';
import { Transfer } from '@substrate/transfer-app';
import { Fab } from '@substrate/ui-components';
import React, { useContext, useEffect, useState } from 'react';
import { Link, Redirect, Route, Switch, useHistory } from 'react-router-dom';

import { KeyringContext } from '../context/KeyringContext';
import { IdentityHeader } from '../IdentityHeader';
import { Signer } from '../Signer';
import { TxQueueNotifier } from '../TxQueueNotifier';

export function Content(): React.ReactElement {
  const history = useHistory();
  const { accounts } = useContext(KeyringContext);
  const [defaultAccount, setDefaultAccount] = useState<string>();

  useEffect(() => {
    const accountsList = Object.keys(accounts);
    accountsList.length && setDefaultAccount(accountsList[0]);

    if (defaultAccount) {
      history.push(`/manageAccounts/${defaultAccount}`);
    }
  }, [accounts, defaultAccount, history]);

  return (
    <>
      <Route
        component={IdentityHeader}
        path={['/addresses/:currentAccount', '/manageAccounts/:currentAccount', '/transfer/:currentAccount']}
      />
      <Route
        path={['/addresses/:currentAccount', '/manageAccounts/:currentAccount']}
        render={(): React.ReactElement => (
          <Link to={`/transfer/${defaultAccount}`}>
            <Fab type='send' />
          </Link>
        )}
      />
      <Switch>
        <Redirect exact from='/' to={`/manageAccounts/${defaultAccount}`} />
        <Route path='/addresses/:currentAccount' component={ManageAddresses} />
        <Route path='/manageAccounts/:currentAccount' component={defaultAccount ? Accounts : AddAccount} />
        <Route path='/accounts/add' component={AddAccount} />
        <Route path='/transfer/:currentAccount' component={Transfer} />
        <Redirect to='/' />
      </Switch>
      <TxQueueNotifier />
      <Signer />
    </>
  );
}
