// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import accounts from '@polkadot/ui-keyring/observable/accounts';
import { Governance } from '@substrate/governance-app';
import { Transfer } from '@substrate/transfer-app';
import { Subscribe } from '@substrate/ui-common';
import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { map } from 'rxjs/operators';

import { AddAccount } from '../AddAccount';
import { IdentityHeader } from '../IdentityHeader';
import { ManageAddresses } from '../ManageAddresses';
import { Onboarding } from '../Onboarding';
import { Signer } from '../Signer';

export function Content () {
  return (
    <React.Fragment>
      <Subscribe>
        {accounts.subject.pipe(
          map(Object.values),
          map(([defaultAccount]) => defaultAccount
            ? (
              <React.Fragment>
                <Route path={['/accounts/:currentAccount/add', '/addresses/:currentAccount', '/governance/:currentAccount', '/transfer/:currentAccount']} component={IdentityHeader} />
                <Switch>
                  <Redirect exact from='/' to={`/governance/${defaultAccount.json.address}`} />
                  <Redirect exact from='/governance' to={`/governance/${defaultAccount.json.address}`} />
                  <Redirect exact from='/transfer' to={`/transfer/${defaultAccount.json.address}`} />
                  <Route path='/addresses/:currentAccount' component={ManageAddresses} />
                  <Route path='/accounts/:currentAccount/add/' component={AddAccount} />
                  <Route path='/governance/:currentAccount' component={Governance} />
                  <Route path='/transfer/:currentAccount' component={Transfer} />
                  <Redirect to='/' />
                </Switch>
              </React.Fragment>
            )
            : <Route component={Onboarding} />
          )
        )}
      </Subscribe>
      <Signer />
    </React.Fragment>
  );
}
