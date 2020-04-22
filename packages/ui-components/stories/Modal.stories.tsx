// Copyright 2018-2020 @paritytech/Nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { action } from '@storybook/addon-actions';
import { withKnobs } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';
import React from 'react';
import { Button } from 'semantic-ui-react';

import {
  FramedBlock,
  Icon,
  Input,
  InputFile,
  Layout,
  Menu,
  Modal,
  NavButton,
  TextArea,
  Transition,
} from '../src';
import { withTheme } from './customDecorators';
import {
  NewMnemonicStory,
  RewriteMnemonicStory,
} from './MnemonicPhraseList.stories';

export const ModalNewMnemonicStory = (): JSX.Element => {
  return (
    <Modal
      trigger={
        <Button basic icon labelPosition='right'>
          <Icon name='plus' />
          Add New
        </Button>
      }
    >
      <Modal.Header>Add Account</Modal.Header>
      <Modal.Content>
        <Input fluid textLabel='Name' onChange={action('typed')} />
        <Menu borderless shadow={false} text size='large'>
          <Menu.Item active>Create New</Menu.Item>
          <Menu.Item>JSON</Menu.Item>
          <Menu.Item>Mnemonic</Menu.Item>
        </Menu>

        <Menu borderless shadow={false} tabs size='tiny'>
          <Menu.Item active>12 words</Menu.Item>
          <Menu.Item>24 words</Menu.Item>
        </Menu>
        <FramedBlock>
          <NewMnemonicStory />
        </FramedBlock>
        <NavButton>Next</NavButton>
      </Modal.Content>
    </Modal>
  );
};
export const ModalRewriteMnemonicStory = (): JSX.Element => {
  return (
    <Modal open>
      <Modal.Header>Account Name</Modal.Header>
      <Modal.Content>
        Lorem Ipsum
        <Menu wrapClass='mt3' borderless shadow={false} tabs size='tiny'>
          <Menu.Item active>Rewrite Mnemonic</Menu.Item>
        </Menu>
        <FramedBlock>
          <RewriteMnemonicStory />
        </FramedBlock>
        <Layout className='mt4 justify-between'>
          <NavButton negative>Back</NavButton>
          <NavButton>Next</NavButton>
          <NavButton wrapClass='o-0'>Back</NavButton>
        </Layout>
      </Modal.Content>
    </Modal>
  );
};
export const ModalEnterMnemonicStory = (): JSX.Element => {
  return (
    <Modal open>
      <Modal.Header>Add Account</Modal.Header>
      <Modal.Content>
        Lorem Ipsum
        <Menu borderless shadow={false} text size='large'>
          <Menu.Item>Create New</Menu.Item>
          <Menu.Item>JSON</Menu.Item>
          <Menu.Item active>Mnemonic</Menu.Item>
        </Menu>
        <div>
          <Menu wrapClass='mt3' borderless shadow={false} tabs size='tiny'>
            <Menu.Item active>Your Mnemonic</Menu.Item>
          </Menu>
        </div>
        <FramedBlock>
          <TextArea signal />
        </FramedBlock>
        <NavButton>Next</NavButton>
      </Modal.Content>
    </Modal>
  );
};
export const ModalEnterJsonStory = (): JSX.Element => {
  return (
    <Modal open>
      <Modal.Header>Add Account</Modal.Header>
      <Modal.Content>
        Lorem Ipsum
        <Menu borderless shadow={false} text size='large'>
          <Menu.Item>Create New</Menu.Item>
          <Menu.Item active>JSON</Menu.Item>
          <Menu.Item>Mnemonic</Menu.Item>
        </Menu>
        <Menu wrapClass='mt3' borderless shadow={false} tabs size='tiny'>
          <Menu.Item active>JSON File</Menu.Item>
        </Menu>
        <FramedBlock>
          <InputFile />
        </FramedBlock>
        <NavButton>Next</NavButton>
      </Modal.Content>
    </Modal>
  );
};

storiesOf('Modal', module)
  .addDecorator(withKnobs)
  .addDecorator(withTheme)
  .add('Modal | Transition', () => (
    <Transition animation='slide up' duration={500} transitionOnMount visible>
      <Modal dimmer open>
        <Modal.Header>This is a header</Modal.Header>
        <Modal.Content>
          This is my content: <Icon name='blind' />
        </Modal.Content>
      </Modal>
    </Transition>
  ))
  .add('Modal | New Mnemonic', () => <ModalNewMnemonicStory />)
  .add('Modal | Rewrite Mnemonic', () => <ModalRewriteMnemonicStory />)
  .add('Modal | Enter Mnemonic', () => <ModalEnterMnemonicStory />)
  .add('Modal | Enter JSON', () => <ModalEnterJsonStory />);
