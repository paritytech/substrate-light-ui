// Copyright 2018-2020 @paritytech/Nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { action } from '@storybook/addon-actions';
import { boolean, select, text, withKnobs } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';
import React from 'react';

import { Input } from '../src';
import { SUIInputSize } from '../src/types';
import { withTheme } from './customDecorators';

const inputTypes = ['number', 'password', 'text'];
const sizes: SUIInputSize[] = [
  'mini',
  'small',
  'large',
  'big',
  'huge',
  'massive',
];

storiesOf('Input', module)
  .addDecorator(withKnobs)
  .addDecorator(withTheme)
  .add('raw input', () => <Input />)
  .add('with props', () => (
    <Input
      disabled={boolean('disabled', false)}
      focus={boolean('focus', false)}
      inverted={boolean('inverted', false)}
      icon={{ name: 'search', link: true }}
      label={text('label', 'Kg')}
      labelPosition='left'
      onChange={action('typed')}
      placeholder='placeholder...'
      size={select('size', sizes, 'small')}
      type={select('input type', inputTypes, 'text')}
    />
  ));
