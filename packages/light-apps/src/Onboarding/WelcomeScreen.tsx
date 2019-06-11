// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { mnemonicGenerate, mnemonicToSeed, naclKeypairFromSeed } from '@polkadot/util-crypto';
import { AppContext } from '@substrate/ui-common';
import FileSaver from 'file-saver';
import { Card, Header, FadedText, FlexItem, Icon, Input, Margin, Modal, Stacked, SubHeader, StackedHorizontal, WithSpaceAround } from '@substrate/ui-components';
import React, { useContext, useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';

interface Props extends RouteComponentProps { }

export function WelcomeScreen (props: Props) {
  const { system } = useContext(AppContext);
  const [difficulty, selectDifficulty] = useState();
  const [step, setStep] = useState(1);

  const createIdle = () => {
    props.history.push('/create');
  };

  const setupNominator = () => {
    setStep(3);
  };

  const onSelectMode = ({ currentTarget: { dataset: { mode } } }: React.MouseEvent<HTMLElement>) => {
    selectDifficulty(mode);
    setStep(2);
  };

  switch (step) {
    case 1:
      return <Intro chain={system.chain} onSelectMode={onSelectMode} />;
    case 2:
      return <ChooseCreationOption difficulty={difficulty} setupNominator={setupNominator} createIdle={createIdle} />;
    case 3:
      return <SetupNominator />;
    default:
      return <Intro chain={system.chain} onSelectMode={onSelectMode} />;
  }
}

function Intro (props: any) {
  return (
    <React.Fragment>
      <Modal.Header>
        Welcome to {props.chain}
        <SubHeader>Made with Parity Substrate</SubHeader>
      </Modal.Header>

      <Modal.Content>
        <Stacked>
          <Header margin='small'>Let's get you started.</Header>
          <SubHeader margin='small'>Choose Your Experience Level.</SubHeader>
          <StackedHorizontal>
            <FlexItem>
              <Card height='17rem' onClick={props.onSelectMode} data-mode='easy'>
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
              <Card height='17rem' onClick={props.onSelectMode} data-mode='hard'>
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
  )
}

function ChooseCreationOption (props: any) {
  const renderEasy = () => {
    return (
      <React.Fragment>
        <Modal.Header>Easy Mode</Modal.Header>
        <Modal.Content>
          <Stacked>
            <FadedText>In order to put your DOTs to use as a light client user, you'll want to nominate a reliable validator. Alternatively, you can opt to sit idle. </FadedText>
            <FadedText>Setting up a nominator profile can be confusing. Luckily, you can get setup with everything you need with this option.</FadedText>

            <StackedHorizontal>
              <FlexItem>
                <Card height='17rem' onClick={props.setupNominator}>
                  <Card.Header><SubHeader>Set Up My Nominator Profile</SubHeader></Card.Header>
                  <Margin top />
                  <Card.Description>
                    <Icon name='sun' size='huge' />
                    <FadedText>This will help you create a Stash and a Controller account and link them together for you.</FadedText>
                  </Card.Description>
                </Card>
              </FlexItem>
              <FlexItem>
                <Card height='17rem' onClick={props.createIdle}>
                  <Card.Header><SubHeader>Create an Idle Account</SubHeader></Card.Header>
                  <Margin top />
                  <Card.Description>
                    <Icon name='moon' size='huge' />
                    <FadedText>This will guide you to create an account manually.</FadedText>
                  </Card.Description>
                </Card>
              </FlexItem>
            </StackedHorizontal>
          </Stacked>
        </Modal.Content>
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

function SetupNominator (props: any) {
  const { keyring } = useContext(AppContext);
  const [stashPassword, setStashPassword] = useState();
  const [promptStashPassword, togglePromptStashPassword] = useState(false);

  const createStash = () => {
    if (!stashPassword) {
      togglePromptStashPassword(true);
      return;
    }

    const mnemonic = mnemonicGenerate();
    const keypair = naclKeypairFromSeed(mnemonicToSeed(mnemonic));

    keyring.encodeAddress(
      keypair.publicKey
    );

    let pair = keyring.createAccountMnemonic(mnemonic, stashPassword, { name: 'Stash', type: 'stash' });

    const address = pair.address();
    const json = pair.toJson(stashPassword);
    const blob = new Blob([JSON.stringify(json)], { type: 'application/json; charset=utf-8' });

    FileSaver.saveAs(blob, `${address}.json`);
  };

  return (
    <React.Fragment>
      <Modal.Header>Setup Nominator Profile</Modal.Header>
      <Modal.Content>
        <Stacked>
          <FadedText> You'll need 2 separate accounts to become a Nominator. </FadedText>

          <StackedHorizontal>
            <FlexItem>
              <Card height='23rem' onClick={createStash}>
                <Card.Header><SubHeader>Stash</SubHeader></Card.Header>
                <Margin top />
                <Card.Description>
                  <Icon name='square full' size='huge' />
                  <WithSpaceAround>
                    <FadedText>The stash key is a key which will in most cases be a cold wallet, existing on a piece of paper in a safe or protected by layers of hardware security. You can think of this as a saving's account at a bank, which ideally is only ever touched in urgent conditions. It should rarely, if ever, be exposed to the internet or used to submit extrinsics.</FadedText>
                  </WithSpaceAround>
                  {
                    promptStashPassword && <Input onChange={setStashPassword}/>
                  }
                </Card.Description>
              </Card>
            </FlexItem>
            <FlexItem>
              <Card height='23rem'>
                <Card.Header><SubHeader>Controller</SubHeader></Card.Header>
                <Margin top />
                <Card.Description>
                  <Icon name='chess board' size='huge' />
                  <WithSpaceAround>
                    <FadedText>Controller keys should hold some DOTs to pay for fees but they should not be used to hold huge amounts or life savings.</FadedText>
                  </WithSpaceAround>
                </Card.Description>
              </Card>
            </FlexItem>
          </StackedHorizontal>
        </Stacked>
      </Modal.Content>
    </React.Fragment>
  );
}