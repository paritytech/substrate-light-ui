// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Breadcrumbs, FadedText, Header, Margin, Modal, Stacked, StyledLinkButton, StyledNavButton, Transition, StackedHorizontal, WrapperDiv } from '@substrate/ui-components';
import React, { useState } from 'react';
import { Route, Switch, RouteComponentProps } from 'react-router-dom';

import { AccountsSetup } from './AccountsSetup';
import { BondingSetup } from './BondingSetup';
import { ONBOARDING_STEPS } from '../constants';
import { Claim } from './Claim';
import { ShowValidators } from './ShowValidators';
import { Welcome } from './Welcome';

interface MatchParams {
  activeOnboardingStep: string;
}

type Props = RouteComponentProps<MatchParams>;

export function Onboarding (props: Props): React.ReactElement {
  const { history, match: { params: { activeOnboardingStep } } } = props;
  const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);

  const confirmSkipOnboarding = (): void => {
    setShowConfirmationDialog(true);
  };

  const skipOnboarding = (): void => {
    localStorage.setItem('skipOnboarding', 'y');

    history.replace('/');
    window.location.reload();
  };

  const navToBreadcrumb = (event: React.MouseEvent<HTMLElement>): void => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    // FIXME: apparently type ChildNode from MouseEvent does not have innerText, but in practice it does. Maybe needs to be more specific than React.MouseEvent<HTMLElement>?
    const text = event.currentTarget.childNodes[0].innerText;
    const to = text.slice(2).replace(/\r?\n|\r/, '').trim();

    history.replace(`/onboarding/${to}`);
  };

  const renderSkipOnboardingOption = (): React.ReactElement => {
    return (
      <Modal
        centered
        dimmer='blurring'
        fitted
        open={showConfirmationDialog}
        size='mini'
        trigger={<StyledLinkButton onClick={confirmSkipOnboarding}>Skip Onboarding</StyledLinkButton>
        }
      >
        <Stacked>
          <Header>Are you sure?</Header>
          <FadedText>You should only skip the onboarding if you really know what you are doing.</FadedText>

          <WrapperDiv width='90%'>
            <StackedHorizontal justifyContent='space-between'>
              <StyledNavButton negative onClick={(): void => setShowConfirmationDialog(false)}>No</StyledNavButton>
              <StyledNavButton onClick={skipOnboarding}>Yes</StyledNavButton>
            </StackedHorizontal>
          </WrapperDiv>
        </Stacked>
      </Modal>
    );
  };

  return (
    <Transition.Group>
      <Modal
        centered
        dimmer='inverted'
        fitted
        open
      >
        <Stacked margin='tiny'>
          <Margin top />
          {renderSkipOnboardingOption()}
          <Margin top />
          <Breadcrumbs activeLabel={activeOnboardingStep.toLowerCase()} onClick={navToBreadcrumb} sectionLabels={ONBOARDING_STEPS} size='mini' />
        </Stacked>
        <Switch>
          <Route path={'/onboarding/welcome'} component={Welcome} />
          <Route path={'/onboarding/stash'} component={AccountsSetup} />
          <Route path={'/onboarding/controller'} component={AccountsSetup} />
          <Route path={'/onboarding/claim'} component={Claim} />
          <Route path={'/onboarding/bond'} component={BondingSetup} />
          <Route path={'/onboarding/nominate'} component={ShowValidators} />
        </Switch>
      </Modal>
    </Transition.Group>
  );
}
