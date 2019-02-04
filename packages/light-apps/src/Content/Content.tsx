// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Identity } from '@polkadot/identity-app';
import { Transfer } from '@polkadot/transfer-app';
import { Container } from '@polkadot/ui-components';
import { inject, observer } from 'mobx-react';
import * as React from 'react';
import { Route, Switch } from 'react-router-dom';

import { IdentityCard } from '../IdentityCard';
import { NotFound } from './NotFound';
import { Onboarding } from '../Onboarding';
import { OnboardingStore } from '../stores/onboardingStore';

interface Props {
  onboardingStore?: OnboardingStore;
}

@inject('onboardingStore')
@observer
export class Content extends React.PureComponent<Props> {
  render () {
    const {
      isFirstRun
    } = this.props.onboardingStore!;

    return (
      <Container>
        {
          isFirstRun
            ? <Route component={Onboarding} />
            : <React.Fragment>
              <Route component={IdentityCard} />
              <Switch>
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
