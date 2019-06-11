// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { mnemonicGenerate, mnemonicToSeed, naclKeypairFromSeed } from '@polkadot/util-crypto';
import { AppContext } from '@substrate/ui-common';
import { Card, FadedText, FlexItem, Icon, Input, Margin, MnemonicSegment, Modal, Stacked, StackedHorizontal, StyledNavButton, SubHeader, WithSpaceAround } from '@substrate/ui-components';
import React, { useContext, useState, useEffect } from 'react';
import { RouteComponentProps } from 'react-router-dom';

interface Props extends RouteComponentProps { }

export function SetupNominator (props: Props) {
  const { keyring } = useContext(AppContext);
  const [controllerPassword, setControllerPassword] = useState<string>();
  const [controllerMnemonic, setControllerMnemonic] = useState();
  const [stashPassword, setStashPassword] = useState<string>();
  const [stashMnemonic, setStashMnemonic] = useState();

  useEffect(() => {
    const stashMnemonic = mnemonicGenerate();
    setStashMnemonic(stashMnemonic);

    const controllerMnemonic = mnemonicGenerate();
    setControllerMnemonic(controllerMnemonic);
  }, []);

  const confirmCreate = () => {
    const stashKeypair = naclKeypairFromSeed(mnemonicToSeed(stashMnemonic));
    const controllerKeyPair = naclKeypairFromSeed(mnemonicToSeed(controllerMnemonic));

    keyring.encodeAddress(
      stashKeypair.publicKey
    );

    keyring.encodeAddress(
      controllerKeyPair.publicKey
    );

    props.history.push(`/transfer`);
  };

  const handleChangeControllerPassword = ({ target: { value } }: React.ChangeEvent<HTMLInputElement>) => {
    setControllerPassword(value);
  };

  const handleChangeStashPassword = ({ target: { value } }: React.ChangeEvent<HTMLInputElement>) => {
    setStashPassword(value);
  };

  return (
    <WithSpaceAround>
      <Modal.Header>Setup Nominator Profile</Modal.Header>
      <Modal.Content>
        <Stacked>
          <FadedText> You'll need 2 separate accounts to become a Nominator. </FadedText>

          <StackedHorizontal>
            <FlexItem>
              <Card height='30rem'>
                <WithSpaceAround>
                  <Card.Header><SubHeader>Stash</SubHeader>{stashPassword && <Icon color='green' name='check' size='small' />}</Card.Header>
                  <Margin top />
                  <Card.Description>
                    <Icon name='square full' size='huge' />
                    <WithSpaceAround>
                      <FadedText>The stash key is a key which will in most cases be a cold wallet, existing on a piece of paper in a safe or protected by layers of hardware security. You can think of this as a saving's account at a bank, which ideally is only ever touched in urgent conditions. It should rarely, if ever, be exposed to the internet or used to submit extrinsics.</FadedText>
                    </WithSpaceAround>
                    <Input label='password' onChange={handleChangeStashPassword} placeholder='enter a password for your stash account.' type='password' value={stashPassword} />
                    <MnemonicSegment mnemonic={stashMnemonic} />
                  </Card.Description>
                </WithSpaceAround>
              </Card>
            </FlexItem>
            <Margin left />
            <FlexItem>
              <Card height='30rem'>
                <WithSpaceAround>
                  <Card.Header><SubHeader>Controller</SubHeader>{controllerPassword && <Icon color='green' name='check' size='small' />}</Card.Header>
                  <Margin top />
                  <Card.Description>
                    <Icon name='chess board' size='huge' />
                    <WithSpaceAround>
                      <FadedText>Controller keys should hold some DOTs to pay for fees but they should not be used to hold huge amounts or life savings.</FadedText>
                    </WithSpaceAround>
                    <Input label='password' onChange={handleChangeControllerPassword} placeholder='enter a password for your controller account.' type='password' value={controllerPassword} />
                    <MnemonicSegment mnemonic={controllerMnemonic} />
                  </Card.Description>
                </WithSpaceAround>
              </Card>
            </FlexItem>
          </StackedHorizontal>
          {stashPassword && controllerPassword && <StyledNavButton onClick={confirmCreate}>Confirm</StyledNavButton>}
        </Stacked>
      </Modal.Content>
    </WithSpaceAround>
  );
}
