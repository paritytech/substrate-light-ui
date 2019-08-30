// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { mnemonicGenerate, mnemonicToSeed, schnorrkelKeypairFromSeed } from '@polkadot/util-crypto';
import { AppContext } from '@substrate/ui-common';
import { Card, FadedText, FlexItem, Icon, Input, Margin, MnemonicSegment, Modal, Stacked, StackedHorizontal, StyledNavButton, SubHeader, WithSpaceAround } from '@substrate/ui-components';
import React, { useContext, useState, useEffect } from 'react';
import { RouteComponentProps } from 'react-router-dom';

const DEFAULT_ACCOUNT_TYPE = 'sr25519';

interface Props extends RouteComponentProps { }

export function SetupNominator (props: Props) {
  const { keyring } = useContext(AppContext);
  const [controllerPassword, setControllerPassword] = useState<string>();
  const [controllerMnemonic, setControllerMnemonic] = useState();
  const [stashPassword, setStashPassword] = useState<string>();
  const [stashMnemonic, setStashMnemonic] = useState();
  const [stashRewrite, setStashRewrite] = useState();
  const [controllerRewrite, setControllerRewrite] = useState();

  useEffect(() => {
    const stashMnemonic = mnemonicGenerate();
    setStashMnemonic(stashMnemonic);

    const controllerMnemonic = mnemonicGenerate();
    setControllerMnemonic(controllerMnemonic);
  }, []);

  const confirmCreate = () => {
    const stashAddress = schnorrkelKeypairFromSeed(mnemonicToSeed(stashMnemonic));
    const controllerAddress = schnorrkelKeypairFromSeed(mnemonicToSeed(controllerMnemonic));

    keyring.encodeAddress(
      stashAddress.publicKey
    );

    keyring.encodeAddress(
      controllerAddress.publicKey
    );

    keyring.addUri(`${stashMnemonic.trim()}`, stashPassword, { name: 'Stash', type: 'stash' }, DEFAULT_ACCOUNT_TYPE);
    const controllerResult = keyring.addUri(`${controllerMnemonic.trim()}`, controllerPassword, { name: 'Controller', type: 'controller' }, DEFAULT_ACCOUNT_TYPE);

    props.history.push(`/transfer/${controllerResult.pair.address}`);
  };

  const handleChangeControllerPassword = ({ target: { value } }: React.ChangeEvent<HTMLInputElement>) => {
    setControllerPassword(value);
  };

  const handleChangeStashPassword = ({ target: { value } }: React.ChangeEvent<HTMLInputElement>) => {
    setStashPassword(value);
  };

  const handleControllerRewrite = ({ target: { value } }: React.ChangeEvent<HTMLInputElement>) => {
    setControllerRewrite(value);
  };

  const handleStashRewrite = ({ target: { value } }: React.ChangeEvent<HTMLInputElement>) => {
    setStashRewrite(value);
  };

  const renderStashCard = () => {
    return (
      <FlexItem>
        <Card height='43rem'>
          <WithSpaceAround>
            <Card.Header><SubHeader>Stash</SubHeader></Card.Header>
            <Margin top />
            <Card.Description>
              <Icon name='square full' size='huge' />
              <WithSpaceAround>
                <FadedText>The stash key is a key which will in most cases be a cold wallet, existing on a piece of paper in a safe or protected by layers of hardware security. You can think of this as a saving's account at a bank, which ideally is only ever touched in urgent conditions. It should rarely, if ever, be exposed to the internet or used to submit extrinsics.</FadedText>
              </WithSpaceAround>
              <SubHeader> Give your new Stash Account a password. </SubHeader>
              <Input label='password' onChange={handleChangeStashPassword} placeholder='enter a password for your stash account.' type='password' value={stashPassword} />
              <SubHeader> Copy down this mnemonic somewhere safe, ideally offline!</SubHeader>
              <MnemonicSegment mnemonic={stashMnemonic} />
              <Margin top />
              <SubHeader> please rewrite your phrase here to confirm you copied it correctly. </SubHeader>
              <Input onChange={handleStashRewrite} placeholder='rewrite the above mnemonic here.' value={stashRewrite} />
              <Margin top />
              <FadedText> IMPORTANT! The above mnemonic is a recovery phrase that anyone can use to access this account. Make sure to keep it safe and private. </FadedText>
              {stashPassword && stashRewrite && <Icon color='green' name='check' size='big' />}
            </Card.Description>
          </WithSpaceAround>
        </Card>
      </FlexItem>
    );
  };

  const renderControllerCard = () => {
    return (
      <FlexItem>
        <Card height='43rem'>
          <WithSpaceAround>
            <Card.Header><SubHeader>Controller</SubHeader></Card.Header>
            <Margin top />
            <Card.Description>
              <Icon name='chess board' size='huge' />
              <WithSpaceAround>
                <FadedText>Your Controller Account is the one you will be using to start or stop nominating, as well as to particpate in governance. Controller keys should hold some DOTs to pay for fees but they should not be used to hold huge amounts or life savings. You may also want to swap them out for a new Controller account every now and then.</FadedText>
              </WithSpaceAround>
              <SubHeader> Give your new Controller Account a password. </SubHeader>
              <Input label='password' onChange={handleChangeControllerPassword} placeholder='enter a password for your controller account.' type='password' value={controllerPassword} />
              <SubHeader> Copy down this mnemonic somewhere safe, ideally offline!</SubHeader>
              <MnemonicSegment mnemonic={controllerMnemonic} />
              <Margin top />
              <SubHeader> please rewrite your phrase here to confirm you copied it correctly. </SubHeader>
              <Input onChange={handleControllerRewrite} placeholder='rewrite the above mnemonic here.' value={controllerRewrite} />
              <Margin top />
              <FadedText> IMPORTANT! The above mnemonic is a recovery phrase that anyone can use to access this account. Make sure to keep it safe and private. </FadedText>
              {controllerPassword && controllerRewrite && <Icon color='green' name='check' size='big' />}
            </Card.Description>
          </WithSpaceAround>
        </Card>
      </FlexItem>
    );
  };

  return (
    <WithSpaceAround>
      <Icon name='arrow left' onClick={props.history.goBack}/>
      <Modal.Header>Setup Nominator Profile</Modal.Header>
      <Modal.Content>
        <Stacked>
          <SubHeader> You'll need 2 separate accounts to become a Nominator. </SubHeader>
          <FadedText> These accounts are only different in how they are intended to be used. There is no underlying cryptographic difference in how their keys are created. </FadedText>
          <Margin bottom />
          <StackedHorizontal>
            { renderStashCard() }
            <Margin left />
            { renderControllerCard() }
          </StackedHorizontal>
          <Margin top='huge' />
          {
            stashPassword
              && controllerPassword
              && stashRewrite === stashMnemonic
              && controllerRewrite === controllerMnemonic
              && <StyledNavButton onClick={confirmCreate}>Confirm</StyledNavButton>
          }
        </Stacked>
      </Modal.Content>
    </WithSpaceAround>
  );
}
