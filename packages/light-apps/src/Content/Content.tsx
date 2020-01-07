// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Accounts, AddAccount, KeyringContext, ManageAddresses } from '@substrate/accounts-app';
import { Transfer } from '@substrate/transfer-app';
import { Fab } from '@substrate/ui-components';
import React, { useContext, useEffect, useState } from 'react';
import { Redirect, Route, Switch, useHistory } from 'react-router-dom';

import { IdentityHeader } from '../IdentityHeader';
import { Signer } from '../Signer';
import { TxQueueNotifier } from '../TxQueueNotifier';

export const Content = (): React.ReactElement => {
  const history = useHistory();
  const { allAccounts } = useContext(KeyringContext);
  const [defaultAccount, setDefaultAccount] = useState<string>();

  useEffect(() => {
    allAccounts && setDefaultAccount(allAccounts[0]);

    if (defaultAccount) {
      history.push(`/manageAccounts/${defaultAccount}`);
    }
  }, [allAccounts, defaultAccount, history]);

  return (
    <>
      <Route
        component={IdentityHeader}
        path={['/addresses/:currentAccount', '/manageAccounts/:currentAccount', '/transfer/:currentAccount']}
      />
      <Route
        path={['/addresses/:currentAccount', '/manageAccounts/:currentAccount']}
        render={(props): React.ReactElement => (
          <Fab onClick={(): void => props.history.push(`/transfer/${defaultAccount}`)} type='send' />
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
};
