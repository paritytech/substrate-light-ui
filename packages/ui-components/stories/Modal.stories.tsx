// Copyright 2018-2020 @paritytech/Nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { withKnobs } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';
import React from 'react';

import { Container, Icon, Modal, Transition } from '../src';
import { withTheme } from './customDecorators';

storiesOf('Modal', module)
  .addDecorator(withKnobs)
  .addDecorator(withTheme)
  .add('with transition', () => (
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
  ));
