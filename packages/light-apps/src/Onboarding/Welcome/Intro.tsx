// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AppContext } from '@substrate/ui-common';
import { Card, Header, FadedText, FlexItem, Icon, Margin, Modal, Stacked, StackedHorizontal, SubHeader, WithSpaceAround } from '@substrate/ui-components';
import React, { useContext } from 'react';

export function Intro (props: any) {
  const { system } = useContext(AppContext);

  const createManually = () => {
    props.history.push('/create');
  };

  const setupNominator = () => {
    props.history.push('/welcome/setupNominator');
  };

  function RenderOptions () {
    return (
      <Stacked>
        <FadedText>In order to put your DOTs to use as a light client user, you'll want to nominate a reliable validator. Alternatively, you can just create an account and setup your nominator profile at a later time. </FadedText>
        <StackedHorizontal>
          <FlexItem>
            <Card height='15rem' onClick={setupNominator}>
              <WithSpaceAround>
                <Card.Header><SubHeader>Set Up My Nominator Profile From Scratch</SubHeader></Card.Header>
                <Margin top='big' />
                <Card.Description>
                  <Icon name='sun' size='huge' />
                  <Margin top='big' />
                  <FadedText>This will help you create a Stash and a Controller account and link them together for you.</FadedText>
                </Card.Description>
              </WithSpaceAround>
            </Card>
          </FlexItem>
          <Margin left />
          <FlexItem>
            <Card height='15rem' onClick={createManually}>
              <WithSpaceAround>
                <Card.Header><SubHeader>Let Me Handle It</SubHeader></Card.Header>
                <Margin top='big' />
                <Card.Description>
                  <Icon name='moon' size='huge' />
                  <Margin top='big' />
                  <FadedText>This will let you to create your account manually.</FadedText>
                </Card.Description>
              </WithSpaceAround>
            </Card>
          </FlexItem>
        </StackedHorizontal>
      </Stacked>
    );
  }

  return (
    <WithSpaceAround>
      <Modal.Header>
        Welcome to {system.chain}, Made with Parity Substrate.
        <Header margin='small'>Let's get you started.</Header>
        <SubHeader margin='small'>Choose How You Want Your Accounts Setup.</SubHeader>
      </Modal.Header>
      <RenderOptions />
    </WithSpaceAround>
  );
}
