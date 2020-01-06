// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import accountObservable from '@polkadot/ui-keyring/observable/accounts';
import { SingleAddress } from '@polkadot/ui-keyring/observable/types';
import { AccountsOverview, AddAccount, KeyringContext } from '@substrate/accounts-app';
import { Transfer } from '@substrate/transfer-app';
import { Container, Sidebar } from '@substrate/ui-components';
import React, { useContext, useEffect, useState } from 'react';
import { Redirect, Route, Switch, useHistory } from 'react-router-dom';

import { IdentityHeader } from '../IdentityHeader';
import { ManageAddresses } from '../ManageAddresses';
import { Signer } from '../Signer';
import { TxQueueNotifier } from '../TxQueueNotifier';

export const Content = (): React.ReactElement => {
  const history = useHistory();
  const { allAccounts } = useContext(KeyringContext);
  const [defaultAccount, setDefaultAccount] = useState<string>();

  useEffect(() => {
    allAccounts && setDefaultAccount(allAccounts[0]);

    // FIXME?: this should rerender then redirect when allAccounts is set, but it doesnt, so doing it manually instead for now.
    if (defaultAccount) {
      history.push(`/manageAccounts/${defaultAccount}`)
    }
  }, [allAccounts, defaultAccount])

  return (
      <>
        <Sidebar.Pushable as={Container} raised="true">
          <Sidebar.Pusher>
            <Route
              path={[
                '/accounts/:currentAccount/add',
                '/addresses/:currentAccount',
                '/manageAccounts/:currentAccount',
              ]}
              component={IdentityHeader}
            />
            <Switch>
              <Route path='/addresses/:currentAccount' component={ManageAddresses} />
              <Route path='/manageAccounts/:currentAccount' component={AccountsOverview} />
              <Route path='/accounts/add' component={AddAccount} />
              {
                defaultAccount
                  ? <Redirect to={`/manageAccounts/${defaultAccount}`} />
                  : <Redirect exact from='/' to='/accounts/add/' />
              }
              <Redirect to='/' />
            </Switch>
            <TxQueueNotifier />
            {/* {defaultAccount && <Transfer currentAccount={defaultAccount.json.address} />} */}
          </Sidebar.Pusher>
        </Sidebar.Pushable>
        <Signer />
      </>
  );
}
