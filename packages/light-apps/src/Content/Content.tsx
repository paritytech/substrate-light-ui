// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import accounts from '@polkadot/ui-keyring/observable/accounts';
import { Accounts } from '@substrate/accounts-app';
import { Governance } from '@substrate/governance-app';
import { SingleAddress } from '@polkadot/ui-keyring/observable/types';
import { Transfer } from '@substrate/transfer-app';
import { AppContext } from '@substrate/ui-common';
import { head } from 'fp-ts/lib/Array';
import { none, Option } from 'fp-ts/lib/Option';
import React, { useContext, useEffect, useState } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { map } from 'rxjs/operators';

import { AddAccount } from '../AddAccount';
import { ONBOARDING_STEPS } from '../constants';
import { IdentityHeader } from '../IdentityHeader';
import { ManageAddresses } from '../ManageAddresses';
import { Onboarding } from '../Onboarding';
import { Signer } from '../Signer';

export function Content () {
  const { api } = useContext(AppContext);
  const [defaultAccount, setDefaultAccount] = useState<Option<SingleAddress>>(none);
  const [isOnboarding, setIsOnboarding] = useState();

  useEffect(() => {
    if (!localStorage.getItem('skipOnboarding')) {
      localStorage.setItem('isOnboarding', 'y');
      setIsOnboarding(true);
    } else {
      setIsOnboarding(false);
    }
  }, []);

  useEffect(() => {
    const accountsSub = accounts.subject
        .pipe(map(Object.values), map(head))
        .subscribe(setDefaultAccount);

    return () => accountsSub.unsubscribe();
  }, [api]);

  const renderOnboarding = () => (
    <React.Fragment>
      <Route path={`/onboarding/:activeOnboardingStep`} component={Onboarding} />
      <Redirect exact from='/' to={`/onboarding/${ONBOARDING_STEPS[0]}`} />
    </React.Fragment>
  );

  return (
    <React.Fragment>
      {
        !isOnboarding
          ? defaultAccount
                  .map(({ json }) => (
                    <React.Fragment>
                      <Route path={['/accounts/:currentAccount/add', '/addresses/:currentAccount', '/governance/:currentAccount', '/manageAccounts/:currentAccount', '/transfer/:currentAccount']} component={IdentityHeader} />
                      <Switch>
                        <Redirect exact from='/' to={`/manageAccounts/${json.address}`} />
                        <Redirect exact from='/governance' to={`/governance/${json.address}`} />
                        <Redirect exact from='/transfer' to={`/transfer/${json.address}`} />
                        <Route path='/addresses/:currentAccount' component={ManageAddresses} />
                        <Route path='/manageAccounts/:currentAccount' component={Accounts} />
                        <Route path='/accounts/:currentAccount/add/' component={AddAccount} />
                        <Route path='/governance/:currentAccount' component={Governance} />
                        <Route path='/transfer/:currentAccount' component={Transfer} />
                        <Redirect to='/' />
                      </Switch>
                    </React.Fragment>
                  )).getOrElse(renderOnboarding())
          : renderOnboarding()
      }
      <Signer />
    </React.Fragment>
  );
}
