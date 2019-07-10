// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AppContext } from '@substrate/ui-common';
import { Container, FadedText, Header, Icon, Step, SubHeader, StackedHorizontal, FlexItem, Margin } from '@substrate/ui-components';
import React, { useContext, useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { fromNullable, none, Option, some } from 'fp-ts/lib/Option';
// import { fromNullable } from 'fp-ts/lib/Either';

interface Props extends RouteComponentProps {}

export function StakingOptions (props: Props) {
  const { system: { properties: { tokenSymbol }, chain } } = useContext(AppContext);
  const [activeStep, setActiveStep] = useState('setup');

  // const nextStep = () => {
  //   switch(activeStep) {
  //     case 'setup':
  //       setActiveStep('bond');
  //       break;
  //     case 'bond':
  //       setActiveStep('nominate');
  //       break;
  //     case 'nominate':
  //       setActiveStep('confirm');
  //       break;
  //     default:
  //       break;
  //   }
  // };

  console.log(setActiveStep);

  return (
    <Container>
        <Header noMargin>Staking Your {tokenSymbol || 'UNIT'}'s on {chain}.</Header>
        <FadedText>Staking helps secure the network and also gives you a chance at earning a portion of the rewards, if the Validators you nominate successfully author a block.</FadedText>
        <SubHeader>Be Careful! You can also get slashed if your Validator misbehaves.</SubHeader>
      <Margin top />
        <StackedHorizontal alignItems='stretch'>
          <FlexItem>
            <Step.Group vertical>
              <Step active={activeStep === 'setup'}>
                <Icon name='truck' />
                <Step.Content>
                  <Step.Title>Account Setup</Step.Title>
                  <Step.Description>Set up the required accounts</Step.Description>
                  <Step.Content>
                    You will need to set up a stash and controller.
                  </Step.Content>
                </Step.Content>
              </Step>

              <Step active={activeStep === 'bond'}>
                <Icon name='payment' />
                <Step.Content>
                  <Step.Title>Set Bonding Preferences</Step.Title>
                  <Step.Description>How much do you want to stake? and more.</Step.Description>
                </Step.Content>
              </Step>

              <Step active={activeStep === 'nominate'}>
                <Icon name='info' />
                <Step.Content>
                  <Step.Title>Nominate Validator(s)</Step.Title>
                  <Step.Description>Nominating your funds to a Validator</Step.Description>
                  <Step.Content> signals that they are trustworthy.</Step.Content>
                </Step.Content>
              </Step>
            </Step.Group>
          </FlexItem>
          <FlexItem>
            {
              // FIX ME this is shite
              fromNullable(activeStep)
                .map((activeStep: string) => activeStep === 'setup' ? some('<Setup />') : none)
                .map((activeStep: Option<string>) => activeStep.toString() === 'bond' ? some('<Bond />') : none)
                .map((activeStep: Option<string>) => activeStep.toString() === 'nominate' ? some('<Nominate />') : none)
                .getOrElse(none).toString()
            }
          </FlexItem>
        </StackedHorizontal>
    </Container>
  );
}
