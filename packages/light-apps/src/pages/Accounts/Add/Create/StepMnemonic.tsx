// Copyright 2018-2020 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import {
  Button,
  FadedText,
  FramedBlock,
  Icon,
  Margin,
  Menu,
  MnemonicPhraseList,
  NavButton,
  Stacked,
  SubHeader,
} from '@substrate/ui-components';
import React from 'react';

interface Props {
  goToNextStep: () => void;
  mnemonic: string;
  setNewMnemonic: () => void;
}

export function AddAccountStepMnemonic(props: Props): React.ReactElement {
  const { mnemonic, goToNextStep, setNewMnemonic } = props;

  return (
    <Stacked>
      <SubHeader>Copy Your Mnemonic Somewhere Safe</SubHeader>
      <FadedText>
        Your private key will be generated from this phrase. Anyone with access
        to this phrase can have full control your funds so make sure to keep it
        a secure and secret.
      </FadedText>
      <Menu borderless shadow={false} tabs size='tiny'>
        <Menu.Item active>Copy the following mnemonic phrase</Menu.Item>
      </Menu>
      <FramedBlock>
        <MnemonicPhraseList phrase={mnemonic} />
        <Button.Group className='absolute bottom-0 right-0'>
          <Button icon onClick={setNewMnemonic}>
            <Icon name='redo' />
          </Button>
        </Button.Group>
      </FramedBlock>
      <Margin top />
      <NavButton onClick={goToNextStep} wrapClass='flex w-100 justify-around'>
        Next
      </NavButton>
    </Stacked>
  );
}
