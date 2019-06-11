// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { mnemonicGenerate, mnemonicToSeed, naclKeypairFromSeed } from '@polkadot/util-crypto';
import { AppContext } from '@substrate/ui-common';
import { Card, FadedText, FlexItem, Icon, Input, Margin, MnemonicSegment, Modal, Stacked, StackedHorizontal, StyledNavButton, SubHeader, WithSpaceAround } from '@substrate/ui-components';
import FileSaver from 'file-saver';
import React, { useContext, useState } from 'react';

export function SetupNominator (props: any) {
  const { keyring } = useContext(AppContext);
  const [controllerPassword, setControllerPassword] = useState<string>();
  const [controllerMnemonic, setControllerMnemonic] = useState();
  const [stashPassword, setStashPassword] = useState<string>();
  const [stashMnemonic, setStashMnemonic] = useState();
  const [promptStashDetails, togglePromptStashDetails] = useState(false);
  const [promptControllerDetails, togglePromptControllerDetails] = useState(false);

  const createStash = () => {
    if (promptStashDetails === false) {
      togglePromptStashDetails(true);
      const stashMnemonic = mnemonicGenerate();
      setStashMnemonic(stashMnemonic);
      return;
    }
  };

  const createController = () => {
    if (promptControllerDetails === false) {
      togglePromptControllerDetails(true);
      const controllerMnemonic = mnemonicGenerate();
      setControllerMnemonic(controllerMnemonic);
      return;
    }
  };

  const confirmCreate = () => {
    const stashKeypair = naclKeypairFromSeed(mnemonicToSeed(stashMnemonic));
    const controllerKeyPair = naclKeypairFromSeed(mnemonicToSeed(controllerMnemonic));

    keyring.encodeAddress(
      stashKeypair.publicKey
    );

    keyring.encodeAddress(
      controllerKeyPair.publicKey
    );

    let stashPair = keyring.createAccountMnemonic(stashMnemonic, stashPassword, { name: 'Stash', type: 'stash' });
    let controllerPair = keyring.createAccountMnemonic(controllerMnemonic, controllerPassword, { name: 'Controller', type: 'controller' });

    const stashAddress = stashPair.address();
    const stashJson = stashPair.toJson(stashPassword);

    const controllerAddress = controllerPair.address();
    const controllerJson = controllerPair.toJson(controllerPassword);

    const stashBlob = new Blob([JSON.stringify(stashJson)], { type: 'application/json; charset=utf-8' });
    const controllerBlob = new Blob([JSON.stringify(controllerJson)], { type: 'application/json; charset=utf-8' });

    // FIXME do this synchronously
    FileSaver.saveAs(stashBlob, `${stashAddress}.json`);
    FileSaver.saveAs(controllerBlob, `${controllerAddress}.json`);
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
              <Card height='23rem' onClick={createStash}>
                <Card.Header><SubHeader>Stash</SubHeader>{stashPassword && <Icon color='green' name='check' size='small' />}</Card.Header>
                <Margin top />
                <Card.Description>
                  <Icon name='square full' size='huge' />
                  <WithSpaceAround>
                    <FadedText>The stash key is a key which will in most cases be a cold wallet, existing on a piece of paper in a safe or protected by layers of hardware security. You can think of this as a saving's account at a bank, which ideally is only ever touched in urgent conditions. It should rarely, if ever, be exposed to the internet or used to submit extrinsics.</FadedText>
                  </WithSpaceAround>
                  {
                    promptStashDetails && (
                      <React.Fragment>
                        <Input label='password' onChange={handleChangeStashPassword} placeholder='enter a password for your stash account.' type='password' value={stashPassword} />
                        <MnemonicSegment mnemonic={stashMnemonic} />
                      </React.Fragment>
                    )
                  }
                </Card.Description>
              </Card>
            </FlexItem>
            <FlexItem>
              <Card height='23rem' onClick={createController}>
                <Card.Header><SubHeader>Controller</SubHeader>{controllerPassword && <Icon color='green' name='check' size='small' />}</Card.Header>
                <Margin top />
                <Card.Description>
                  <Icon name='chess board' size='huge' />
                  <WithSpaceAround>
                    <FadedText>Controller keys should hold some DOTs to pay for fees but they should not be used to hold huge amounts or life savings.</FadedText>
                  </WithSpaceAround>
                  {
                    promptControllerDetails && (
                      <React.Fragment>
                        <Input label='password' onChange={handleChangeControllerPassword} placeholder='enter a password for your controller account.' type='password' value={controllerPassword} />
                        <MnemonicSegment mnemonic={controllerMnemonic} />
                      </React.Fragment>
                    )
                  }
                </Card.Description>
              </Card>
            </FlexItem>
          </StackedHorizontal>
          {stashPassword && controllerPassword && <StyledNavButton onClick={confirmCreate}>Confirm</StyledNavButton>}
        </Stacked>
      </Modal.Content>
    </WithSpaceAround>
  );
}