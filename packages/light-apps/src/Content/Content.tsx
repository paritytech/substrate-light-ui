// Copyright 2018-2020 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Accounts, ManageAddresses } from '@substrate/accounts-app';
import { KeyringContext } from '@substrate/context';
import { Transfer } from '@substrate/transfer-app';
import { Fab } from '@substrate/ui-components';
import React, { useContext } from 'react';
import { Link, Redirect, Route, Switch } from 'react-router-dom';

import { IdentityHeader } from '../IdentityHeader';
import { Signer } from '../Signer';
import { TxQueueNotifier } from '../TxQueueNotifier';

export function Content(): React.ReactElement {
  const { currentAccount } = useContext(KeyringContext);

  return (
    <>
      <Route component={IdentityHeader} path={['/addresses', '/accounts', '/transfer/:currentAccount']} />
      {currentAccount && (
        <Route
          render={(): React.ReactElement => (
            <Link to={`/transfer/${currentAccount}`}>
              <Fab type='send' />
            </Link>
          )}
        />
      )}
      <Switch>
        <Redirect exact from='/' to='accounts' />
        <Route path='/addresses' component={ManageAddresses} />
        <Route path='/accounts' component={Accounts} />
        <Route path='/transfer/:currentAccount' component={Transfer} />
        <Redirect to='/' />
      </Switch>
      <TxQueueNotifier />
      <Signer />
    </>
  );
}
