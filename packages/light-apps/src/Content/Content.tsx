// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import accounts from '@polkadot/ui-keyring/observable/accounts';
import { SingleAddress } from '@polkadot/ui-keyring/observable/types';
import { AccountsOverview, AddAccount } from '@substrate/accounts-app';
import { ApiContext } from '@substrate/context';
import { Transfer } from '@substrate/transfer-app';
import { Container, Sidebar } from '@substrate/ui-components';
import React, { useContext, useEffect, useState } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

import { IdentityHeader } from '../IdentityHeader';
import { ManageAddresses } from '../ManageAddresses';
import { Signer } from '../Signer';
import { TxQueueNotifier } from '../TxQueueNotifier';

export function Content(): React.ReactElement {
  const { api } = useContext(ApiContext);

  const [defaultAccount, setDefaultAccount] = useState<SingleAddress | undefined>(undefined);

  useEffect(() => {
    const accountsSub = accounts.subject.subscribe(accounts => setDefaultAccount(accounts[Object.keys(accounts)[0]]));

    return (): void => accountsSub.unsubscribe();
  }, [api]);

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
                ? <Redirect exact from='/' to={`/manageAccounts/${defaultAccount.json.address}`} />
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
