// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { text, withKnobs } from '@storybook/addon-knobs';

import { withTheme } from './customDecorators';
import NavButton from '../src/NavButton';

storiesOf('NavButton', module)
  .addDecorator(withKnobs)
  .addDecorator(withTheme)
  .add('no children', () => (
    <NavButton />
  ))
  .add('with child string', () => (
    <NavButton onClick={action('clicked')}> {text('child', 'Button')} </NavButton>
  ))
  .add('with value prop', () => (
    <NavButton
      onClick={action('clicked')}
      value={text('value', 'Button')}> This should be ignored </NavButton>
  ))
  .add('with font props', () => (
    <NavButton
      fontSize={text('font size', '17px')}
      fontWeight={text('font weight', '500')}
      onClick={action('clicked')}>
        {text('child', 'Button')}
    </NavButton>
  ));
