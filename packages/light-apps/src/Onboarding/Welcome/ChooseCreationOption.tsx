// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Card, FadedText, FlexItem, Icon, Margin, Modal, Stacked, StackedHorizontal, SubHeader, WithSpaceAround } from '@substrate/ui-components';
import React from 'react';
import { RouteComponentProps } from 'react-router-dom';

interface MatchParams {
  option: string;
}

interface Props extends RouteComponentProps<MatchParams> { }

export function ChooseCreationOption (props: Props) {
  const createIdle = () => {
    props.history.push('/create');
  };

  const setupNominator = () => {
    props.history.push('/welcome/setupNominator');
  };

  const renderEasy = () => {
    return (
      <WithSpaceAround>
        <Modal.Header>Easy Mode</Modal.Header>
        <Modal.Content>
          <Stacked>
            <FadedText>In order to put your DOTs to use as a light client user, you'll want to nominate a reliable validator. Alternatively, you can opt to sit idle. </FadedText>
            <FadedText>Setting up a nominator profile can be confusing. Luckily, you can get setup with everything you need with this option.</FadedText>

            <StackedHorizontal>
              <FlexItem>
                <Card height='17rem' onClick={setupNominator}>
                  <WithSpaceAround>
                    <Card.Header><SubHeader>Set Up My Nominator Profile</SubHeader></Card.Header>
                    <Margin top />
                    <Card.Description>
                      <Icon name='sun' size='huge' />
                      <FadedText>This will help you create a Stash and a Controller account and link them together for you.</FadedText>
                    </Card.Description>
                  </WithSpaceAround>
                </Card>
              </FlexItem>
              <Margin left />
              <FlexItem>
                <Card height='17rem' onClick={createIdle}>
                  <WithSpaceAround>
                    <Card.Header><SubHeader>Create an Idle Account</SubHeader></Card.Header>
                    <Margin top />
                    <Card.Description>
                      <Icon name='moon' size='huge' />
                      <FadedText>This will guide you to create an account manually.</FadedText>
                    </Card.Description>
                  </WithSpaceAround>
                </Card>
              </FlexItem>
            </StackedHorizontal>
          </Stacked>
        </Modal.Content>
      </WithSpaceAround>
    );
  };

  const renderHard = () => {
    return (
      <React.Fragment>
        <Modal.Header>Hard Mode</Modal.Header>
      </React.Fragment>
    );
  };

  if (props.match.params.option === 'easy') {
    return renderEasy();
  } else {
    return renderHard();
  }
}
