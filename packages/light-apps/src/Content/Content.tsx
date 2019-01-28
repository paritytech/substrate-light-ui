// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Identity } from '@polkadot/identity-app';
import { Transfer } from '@polkadot/transfer-app';
import { Container } from '@polkadot/ui-components';
import keyring from '@polkadot/ui-keyring';

import { inject, observer } from 'mobx-react';
import React from 'react';
import { Route, RouteComponentProps, Switch } from 'react-router-dom';

import { IdentityCard } from '../IdentityCard';
import { NotFound } from './NotFound';
import { Onboarding } from '../Onboarding';
import { OnboardingStore } from '../stores/onboardingStore';

interface Props extends RouteComponentProps {
  onboardingStore: OnboardingStore;
}

@inject('onboardingStore')
@observer
export class Content extends React.Component<Props> {

  render () {
    const {
      location,
      onboardingStore: {
        isFirstRun
      }
    } = this.props;

    const current = location.pathname.split('/')[1];
    const address = location.pathname.split('/')[2];
    let name;
    // FIXME: Only load keyring once in light-apps after light-api is set
    try {
      keyring.loadAll();
      name = keyring.getAccount(address).getMeta().name;
    } catch (e) {
      console.log(e);
    }

    console.log(location.pathname);

    return (
      <Container>
        {
          isFirstRun
            ? <Route component={Onboarding} />
            : <React.Fragment>
                <IdentityCard
                  address={address}
                  name={name}
                  to={current === 'identity' ? 'transfer' : 'identity'}
                  {...this.props}
                />
                <Switch>
                  <Route path='identity' component={Identity} />
                  <Route path='transfer' component={Transfer} />
                  <Route component={NotFound} />
                </Switch>
            </React.Fragment>
        }
      </Container>
    );
  }
}
