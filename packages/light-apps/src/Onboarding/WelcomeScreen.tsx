// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AppContext } from '@substrate/ui-common';
import { Card, Header, FadedText, FlexItem, Icon, Margin, Modal, Stacked, SubHeader, StackedHorizontal, WithSpaceAround } from '@substrate/ui-components';
import React, { useContext, useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';

interface Props extends RouteComponentProps { }

export function WelcomeScreen (props: Props) {
  const { system } = useContext(AppContext);
  const [difficulty, selectDifficulty] = useState();
  const [step, setStep] = useState(1);

  const onSelectMode = ({ currentTarget: { dataset: { mode } } }: React.MouseEvent<HTMLElement>) => {
    selectDifficulty(mode);
    setStep(2);
  };

  if (step === 1) {
    return (
      <React.Fragment>
        <Modal.Header>
          Welcome to {system.chain}
          <SubHeader>Made with Parity Substrate</SubHeader>
        </Modal.Header>

        <Modal.Content>
          <Stacked>
            <Header margin='small'>Let's get you started.</Header>
            <SubHeader margin='small'>Choose Your Experience Level.</SubHeader>
            <StackedHorizontal>
              <FlexItem>
                <Card height='20rem' onClick={onSelectMode} data-mode='easy'>
                  <Card.Header><SubHeader>Automatic (recommended)</SubHeader></Card.Header>
                  <Margin top />
                  <Card.Description>
                    <Icon size='huge' name='car' />
                    <Margin top />
                    <WithSpaceAround>
                      <FadedText>I want my experience to be as seamless as possible by opting into the default settings.</FadedText>
                    </WithSpaceAround>
                  </Card.Description>
                </Card>
              </FlexItem>
              <Margin left />
              <FlexItem>
                <Card height='20rem' onClick={onSelectMode} data-mode='hard'>
                  <Card.Header><SubHeader>Manual</SubHeader></Card.Header>
                  <Margin top />
                  <Card.Description>
                    <Icon size='huge' name='sticker mule' />
                    <Margin top />
                    <WithSpaceAround>
                      <FadedText>I know what I am doing and I want to be involved with every step of the process of setting up my accounts and interacting with my chain.</FadedText>
                    </WithSpaceAround>
                  </Card.Description>
                </Card>
              </FlexItem>
            </StackedHorizontal>
          </Stacked>
        </Modal.Content>
      </React.Fragment>
    );
  } else {
    return <Details difficulty={difficulty} />;
  }
}

function Details (props: any) {
  const renderEasy = () => {
    return (
      <React.Fragment>
        <Modal.Header>Easy Mode</Modal.Header>
      </React.Fragment>
    );
  };

  const renderHard = () => {
    return (
      <React.Fragment>
        <Modal.Header>Hard Mode</Modal.Header>
      </React.Fragment>
    );
  };

  if (props.difficulty === 'easy') {
    return renderEasy();
  } else {
    return renderHard();
  }
}