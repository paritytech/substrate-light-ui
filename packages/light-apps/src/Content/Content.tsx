// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Container, IdentityCard } from '@polkadot/ui-components';
import keyring from '@polkadot/ui-keyring';

import { inject, observer } from 'mobx-react';
import React from 'react';
import { Route, RouteComponentProps, Switch } from 'react-router-dom';

import { NotFound } from './NotFound';
import { Onboarding } from '../Onboarding';
import { routing } from '../routing';
import { OnboardingStore } from '../stores/onboardingStore';

interface Props extends RouteComponentProps {
  onboardingStore: OnboardingStore;
}

const ID_CARD_ACTIONS = (name: string) => {
  switch (name) {
    case 'Identity':
      return {
        'value': 'Transfer Balance',
        'to': 'Transfer'
      };
    case 'Transfer':
      return {
        'value': 'Manage Accounts',
        'to': 'Identity'
      };
    default:
      return {
        'value': 'Transfer Balance',
        'to': 'Transfer'
      };
  }
};

@inject('onboardingStore')
@observer
export class Content extends React.Component<Props> {
  handleRouteChange = (to?: string) => {
    const { history, location } = this.props;

    if (!to) {
      const current = location.pathname.split('/')[1];
      const address = location.pathname.split('/')[2];
      to = `${ID_CARD_ACTIONS(current)['to']}/${address}`;
    }

    history.push(`/${to}`);
  }

  render () {
    const {
      location,
      onboardingStore: {
        isFirstRun
      }
    } = this.props;

    const address = location.pathname.split('/')[2];
    let name;
    // FIXME: Only load keyring once in light-apps after light-api is set
    try {
      keyring.loadAll();
      name = keyring.getAccount(address).getMeta().name;
    } catch (e) {
      console.log(e);
    }

    return (
      <Container>
        {
          isFirstRun
            ? <Route component={Onboarding} />
            : <React.Fragment>
                <IdentityCard
                  address={address}
                  name={name}
                  goToRoute={this.handleRouteChange}
                  value={ID_CARD_ACTIONS(location.pathname.split('/')[1])['value']}
                />
                <Switch>
                  {routing.routes.map(route => <Route key={route.name} path={route.path} component={route.Component} />)}
                  <Route component={NotFound} />
                </Switch>
            </React.Fragment>
        }
      </Container>
    );
  }
}
