// Copyright 2018-2020 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Container, Fab } from '@substrate/ui-components';
import React, { useContext } from 'react';
import { Link, Redirect, Route, Switch } from 'react-router-dom';

import { Accounts } from '../Accounts';
import { KeyringContext } from '../ContextGate/context';
import { IdentityHeader } from '../IdentityHeader';
import { Signer } from '../Signer';
import { Transfer } from '../Transfer';
import { TxQueueNotifier } from '../TxQueueNotifier';

export function Routes(): React.ReactElement {
  const { currentAccount } = useContext(KeyringContext);

  return (
    <Container>
      <Route component={IdentityHeader} path={['/accounts', '/transfer']} />
      {currentAccount && (
        <Route
          render={(): React.ReactElement => (
            <Link to='/transfer'>
              <Fab type='send' />
            </Link>
          )}
        />
      )}
      <Switch>
        <Redirect exact from='/' to='/accounts' />
        <Route path='/accounts' component={Accounts} />
        <Route path='/transfer' component={Transfer} />
        <Redirect to='/' />
      </Switch>
      <TxQueueNotifier />
      <Signer />
    </Container>
  );
}
