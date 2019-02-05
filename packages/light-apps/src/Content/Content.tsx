// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Identity } from '@polkadot/identity-app';
import { Transfer } from '@polkadot/transfer-app';
import { Container } from '@polkadot/ui-components';
import keyring from '@polkadot/ui-keyring';
import { inject, observer } from 'mobx-react';
import * as React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

import { IdentityCard } from '../IdentityCard';
import { NotFound } from './NotFound';
import { Onboarding } from '../Onboarding';
import { OnboardingStore } from '../stores/onboardingStore';

interface Props {
  onboardingStore: OnboardingStore;
}

@inject('onboardingStore')
@observer
export class Content extends React.Component<Props> {
  render () {
    const [defaultAccount] = keyring.getPairs();
    const defaultAddress = defaultAccount && defaultAccount.address();
    const {
      onboardingStore: { isFirstRun }
    } = this.props;

    return (
      <Container>
        {
          (isFirstRun || !defaultAddress)
            ? <Route component={Onboarding} />
            : <React.Fragment>
              <Route component={IdentityCard} />
              <Switch>
                <Redirect exact from='/identity' to={`/identity/${defaultAddress}`} />
                <Redirect exact from='/transfer' to={`/transfer/${defaultAddress}`} />
                <Route path='/identity/:currentAddress' component={Identity} />
                <Route path='/transfer/:currentAddress' component={Transfer} />
                <Route component={NotFound} />
              </Switch>
            </React.Fragment>
        }
      </Container>
    );
  }
}
