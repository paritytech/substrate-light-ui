// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { storiesOf } from '@storybook/react';
import React from 'react';

import { Card, Transition } from '../src';
import { withTheme } from './customDecorators';

storiesOf('Transition', module)
  .addDecorator(withTheme)
  .add('on card mount', () => (
    <Transition animation='scale' duration={1000} transitionOnMount visible>
      <Card fluid>
        <Card.Header>Welcome to the Polkadot Nominator Community.</Card.Header>
        <Card.Description>Hello World.</Card.Description>
      </Card>
    </Transition>
  ))
  .add('subcomponent', () => (
    <Card fluid>
      <Transition animation='scale' duration={1000} transitionOnMount visible>
        <Card.Header>Welcome to the Polkadot Nominator Community.</Card.Header>
      </Transition>
      <Card.Description>Hello World.</Card.Description>
    </Card>
  ));
