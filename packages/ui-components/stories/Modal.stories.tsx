// Copyright 2018-2020 @paritytech/Nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { action } from '@storybook/addon-actions';
import { withKnobs } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';
import React from 'react';
import { Button } from 'semantic-ui-react';

import {
  Container,
  Icon,
  Input,
  Menu,
  Modal,
  NavButton,
  Transition,
} from '../src';
import { withTheme } from './customDecorators';
import { NewMnemonicStory } from './MnemonicPhraseList.stories';

export const ModalNewAccountStory = (): JSX.Element => {
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
        <div className='w-100'>
          <Input fluid textLabel='Name' onChange={action('typed')} />
          <Menu borderless shadow={false} text size='large'>
            <Menu.Item active>Create New</Menu.Item>
            <Menu.Item>JSON</Menu.Item>
            <Menu.Item>Signer</Menu.Item>
            <Menu.Item>Mnemonic</Menu.Item>
          </Menu>

          <Menu borderless shadow={false} tabs size='tiny'>
            <Menu.Item active>12 words</Menu.Item>
            <Menu.Item>24 words</Menu.Item>
          </Menu>
          {/* TODO framed box with actions */}
          <div className='ba pa4'>
            <NewMnemonicStory />
          </div>
          <NavButton wrapClass='flex mt4 mb3 w-100 justify-around'>
            Next
          </NavButton>
        </div>
      </Modal.Content>
    </Modal>
  );
};

storiesOf('Modal', module)
  .addDecorator(withKnobs)
  .addDecorator(withTheme)
  .add('Transition', () => (
    <Container>
      <Transition animation='slide up' duration={500} transitionOnMount visible>
        <Modal dimmer open>
          <Modal.Header>This is a header</Modal.Header>
          <Modal.SubHeader>This is a subheader</Modal.SubHeader>
          <Modal.Content>
            This is my content: <Icon name='blind' />
          </Modal.Content>
        </Modal>
      </Transition>
    </Container>
  ))
  .add('New Account', () => <ModalNewAccountStory />);
