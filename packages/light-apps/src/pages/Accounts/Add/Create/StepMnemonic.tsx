// Copyright 2018-2020 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import {
  Button,
  Header,
  Icon,
  Layout,
  Menu,
  MnemonicPhraseList,
  NavButton,
  Paragraph,
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
    <>
      <Menu borderless shadow={false} tabs size='tiny'>
        <Menu.Item active>Copy the following mnemonic phrase</Menu.Item>
      </Menu>
      <Layout framed>
        <MnemonicPhraseList phrase={mnemonic} />
        <Button.Group className='absolute bottom-0 right-0'>
          <Button icon onClick={setNewMnemonic}>
            <Icon name='redo' />
          </Button>
        </Button.Group>
      </Layout>
      <Header as='h4' wrapClass='mt3'>
        Copy your Mnemonic Somewhere Safe
      </Header>
      <Paragraph faded>
        Your private key will be generated from this phrase. Anyone with access
        to this phrase can have full control your funds so make sure to keep it
        a secure and secret.
      </Paragraph>
      <Layout className='justify-around mt4'>
        <NavButton onClick={goToNextStep}>Next</NavButton>
      </Layout>
    </>
  );
}
