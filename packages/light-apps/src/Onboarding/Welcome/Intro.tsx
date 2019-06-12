// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AppContext } from '@substrate/ui-common';
import { Card, Header, FadedText, FlexItem, Icon, Margin, Modal, Stacked, StackedHorizontal, SubHeader, WithSpaceAround } from '@substrate/ui-components';
import React, { useContext } from 'react';

export function Intro (props: any) {
  const { system } = useContext(AppContext);

  const onSelectMode = ({ currentTarget: { dataset: { mode } } }: React.MouseEvent<HTMLElement>) => {
    props.history.push(`/welcome/chooseCreationOption/${mode}`);
  };

  return (
    <WithSpaceAround>
      Welcome to {system.chain}, Made with Parity Substrate
      <Modal.Header>
        <Header margin='small'>Let's get you started.</Header>
        <SubHeader margin='small'>Choose Your Experience Level.</SubHeader>
      </Modal.Header>

      <Modal.Content>
        <Stacked>
          <StackedHorizontal>
            <FlexItem>
              <Card height='17rem' onClick={onSelectMode} data-mode='easy'>
                <WithSpaceAround>
                  <Card.Header><SubHeader>Automatic (recommended)</SubHeader></Card.Header>
                  <Margin top />
                  <Card.Description>
                    <Icon size='huge' name='car' />
                    <Margin top />
                    <WithSpaceAround>
                      <FadedText>I want my experience to be as seamless as possible by opting into the default settings.</FadedText>
                    </WithSpaceAround>
                  </Card.Description>
                </WithSpaceAround>
              </Card>
            </FlexItem>
            <Margin left />
            <FlexItem>
              <Card height='17rem' onClick={onSelectMode} data-mode='hard'>
                <WithSpaceAround>
                  <Card.Header><SubHeader>Manual</SubHeader></Card.Header>
                  <Margin top />
                  <Card.Description>
                    <Icon size='huge' name='sticker mule' />
                    <Margin top />
                    <WithSpaceAround>
                      <FadedText>I know what I am doing and I want to be involved with every step of the process of setting up my accounts and interacting with my chain.</FadedText>
                    </WithSpaceAround>
                  </Card.Description>
                </WithSpaceAround>
              </Card>
            </FlexItem>
          </StackedHorizontal>
        </Stacked>
      </Modal.Content>
    </WithSpaceAround>
  );
}
