// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { boolean, select, text, withKnobs } from '@storybook/addon-knobs';

import { withTheme } from './customDecorators';
import { Container, Input } from '../src';

const inputTypes = ['number', 'password', 'text'];
const sizes = ['mini', 'tiny', 'small', 'medium', 'large', 'big', 'huge', 'massive'];

storiesOf('Input', module)
  .addDecorator(withKnobs)
  .addDecorator(withTheme)
  .add('raw input', () => (
    <Input />
  ))
  .add('with props', () => (
    <Container style={{ background: 'white', width: '100%' }}>
      <Input
        disabled={boolean('disabled', false)}
        fluid
        focus={boolean('focus', false)}
        inverted={boolean('inverted', false)}
        label={text('label', 'Kg')}
        labelPosition='left'
        onChange={action('typed')}
        placeholder='placeholder...'
        type={select('input type', inputTypes, 'text')} />
    </Container>
  ));
