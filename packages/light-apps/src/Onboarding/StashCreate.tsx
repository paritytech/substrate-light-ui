// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Card, FadedText, Modal, WithSpaceAround, StyledNavButton, WrapperDiv } from '@substrate/ui-components';
import React from 'react';
import { RouteComponentProps } from 'react-router-dom';

import { Create } from '../AddAccount/Create';
import { Restore } from '../AddAccount/Restore';

interface Props extends RouteComponentProps { }

export function StashCreate (props: Props) {
  const { history } = props;

  const navToCreateController = () => {
    history.push('/onboarding/controller');
  };

  return (
    <WithSpaceAround>
      <Modal.Content>
        <WrapperDiv>
          <Card maxHeight='15%'>
            <Card.Header>Restore</Card.Header>
            <Restore {...props} />
          </Card>
        </WrapperDiv>
        <WrapperDiv>
          <Card maxHeight='15%'>
            <Card.Header>Restore</Card.Header>
            <Create {...props} />
          </Card>
        </WrapperDiv>
      </Modal.Content>
      <Modal.Content extra>
        <WithSpaceAround>
          <FadedText>You should use your Stash account as a cold store for the majority of your funds.</FadedText>
        </WithSpaceAround>
      </Modal.Content>
      <Modal.Actions>
        <StyledNavButton onClick={navToCreateController}> Next </StyledNavButton>
      </Modal.Actions>
    </WithSpaceAround>
  )
}