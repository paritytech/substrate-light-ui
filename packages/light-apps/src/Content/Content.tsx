// Copyright 2017-2018 @polkadot/light-apps authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import { Route, RouteComponentProps, Switch } from 'react-router-dom';
import { Container, IdentityCard } from '@polkadot/ui-components';
import { inject, observer } from 'mobx-react';

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
      const current = location.pathname.slice(1);
      to = ID_CARD_ACTIONS(current)['to'];
    }

    history.push(`/${to}`);
  }

  render () {
    const { onboardingStore } = this.props;

    return (
      <Container>
        {
          onboardingStore.isFirstRun
            ? <Route component={Onboarding} />
            : <React.Fragment>
              <IdentityCard
                address={'7qroA7r5Ky9FHN5mXA2GNxZ79ieStv4WYYjYe3m3XszK9SvF'}
                goToRoute={this.handleRouteChange}
                value={ID_CARD_ACTIONS(name)['value']}
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

// FIXME:
// address should come from Keyring
