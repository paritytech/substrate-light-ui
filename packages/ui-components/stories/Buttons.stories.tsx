// Copyright 2018-2020 @paritytech/Nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { action } from '@storybook/addon-actions';
import { select, text, withKnobs } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';
import React from 'react';

import { FONT_SIZES } from '../src/constants';
import { NavButton } from '../src/NavButton';
import { VoteNayButton, VoteYayButton } from '../src/Shared.styles';
import { FontSize } from '../src/types';
import { withTheme } from './customDecorators';

storiesOf('Button', module)
  .addDecorator(withKnobs)
  .addDecorator(withTheme)
  .add('NavButton | no children', () => <NavButton />)
  .add('NavButton | with child string', () => (
    <NavButton onClick={action('clicked')}>
      {' '}
      {text('child', 'Button')}{' '}
    </NavButton>
  ))
  .add('NavButton | with value prop', () => (
    <NavButton onClick={action('clicked')} value={text('value', 'Button')}>
      {' '}
      This should be ignored{' '}
    </NavButton>
  ))
  .add('NavButton | with font props', () => (
    <NavButton
      fontSize={select('font size', FONT_SIZES, 'medium') as FontSize}
      fontWeight={text('font weight', '500')}
      onClick={action('clicked')}
    >
      {text('child', 'Button')}
    </NavButton>
  ))
  .add('VoteButtons | ', () => (
    <React.Fragment>
      <VoteYayButton onClick={action('Yay')}> Yay </VoteYayButton>
      <VoteNayButton onClick={action('Nay')}> Nay </VoteNayButton>
    </React.Fragment>
  ));
