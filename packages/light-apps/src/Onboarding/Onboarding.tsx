// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Validators } from '@substrate/accounts-app/';
import { Breadcrumbs, Modal, Stacked, Transition, WithSpaceAround } from '@substrate/ui-components';
import React from 'react';
import { Route, Switch, RouteComponentProps } from 'react-router-dom';

import { AccountsSetup } from './AccountsSetup';
import { BondingSetup } from './BondingSetup';
import { ONBOARDING_STEPS } from '../constants';
import { Claim } from './Claim';
import { Welcome } from './Welcome';

interface MatchParams {
  activeOnboardingStep: string;
}

interface Props extends RouteComponentProps<MatchParams> { }

export function Onboarding (props: Props) {
  const { history, match: { params: { activeOnboardingStep } } } = props;

  const navToBreadcrumb = (event: React.MouseEvent<HTMLElement>, data: any) => {
    // @ts-ignore
    // FIXME: apparently type ChildNode from MouseEvent does not have innerText, but in practice it does. Maybe needs to be more specific than React.MouseEvent<HTMLElement>?
    let text = event.currentTarget.childNodes[0].innerText;
    let to = text.slice(2).replace(/\r?\n|\r/, '').trim();

    history.replace(`/onboarding/${to}`);
  };

  return (
    <Transition.Group>
      <Modal
        centered
        dimmer='inverted'
        fitted
        open
      >
        <Switch>
          <Route path={`/onboarding/welcome`} component={Welcome} />
          <Route path={'/onboarding/stash'} component={AccountsSetup} />
          <Route path={'/onboarding/controller'} component={AccountsSetup} />
          <Route path={'/onboarding/claim'} component={Claim} />
          <Route path={'/onboarding/bond'} component={BondingSetup} />
          <Route path={'/onboarding/nominate'} component={Validators} />
        </Switch>
        <WithSpaceAround>
          <Stacked>
            <Breadcrumbs activeLabel={activeOnboardingStep.toLowerCase()} onClick={navToBreadcrumb} sectionLabels={ONBOARDING_STEPS} size='mini' />
          </Stacked>
          </WithSpaceAround>
      </Modal>
    </Transition.Group>
  );
}
