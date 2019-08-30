// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Breadcrumbs, Header, Modal, WithSpaceAround } from '@substrate/ui-components';
import React from 'react';
import { Route, Switch, RouteComponentProps } from 'react-router-dom';

import { ONBOARDING_STEPS } from '../constants';
import { StashCreate } from './StashCreate';
import { TermsAndConditions } from './TermsAndConditions';

interface MatchParams {
  activeOnboardingStep: string;
}

interface Props extends RouteComponentProps<MatchParams> { }

export function Onboarding (props: Props) {
  const { match: { params: { activeOnboardingStep } } } = props;

  return (
    <Modal
      dimmer='inverted'
      open
      size='large'
    >
      <Modal.Header>
        <WithSpaceAround><Breadcrumbs activeLabel={activeOnboardingStep.toUpperCase()} sectionLabels={ONBOARDING_STEPS} /></WithSpaceAround>
        <Header margin='small'>Welcome to the Kusama Nominator Community.</Header>
      </Modal.Header>
      <Switch>
        <Route path={`/onboarding/${'T&C'}`} component={TermsAndConditions} />
        <Route path={'/onboarding/stash'} component={StashCreate} />
      </Switch>
    </Modal>
  );
}
