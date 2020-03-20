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
  .add('NavButton', () => (
    <NavButton
      fontSize={select('font size', FONT_SIZES, 'large') as FontSize}
      fontWeight={text('font weight', '500')}
      onClick={action('clicked')}
    >
      {text('children', 'Click Me!')}
    </NavButton>
  ))
  .add('VoteButtons', () => (
    <React.Fragment>
      <VoteYayButton onClick={action('Yay')}> Yay </VoteYayButton>
      <VoteNayButton onClick={action('Nay')}> Nay </VoteNayButton>
    </React.Fragment>
  ));
