// Copyright 2018-2020 @paritytech/Nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { action } from '@storybook/addon-actions';
import { boolean, text, withKnobs } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';
import React from 'react';

import { Button } from '../src/Button';
import { NavButton } from '../src/NavButton';
import { VoteNayButton, VoteYayButton } from '../src/Shared.styles';
import { withTheme } from './customDecorators';

storiesOf('Button', module)
  .addDecorator(withKnobs)
  .addDecorator(withTheme)
  .add('Button', () => <Button> Button</Button>)
  .add('NavButton', () => {
    const className = text('className', '');
    const negative = boolean('negative', false);
    const onClick = action('clicked');

    return (
      <NavButton onClick={onClick} negative={negative} className={className}>
        {text('children', 'Click Me!')}
      </NavButton>
    );
  })
  .add('VoteButtons', () => (
    <React.Fragment>
      <VoteYayButton onClick={action('Yay')}> Yay </VoteYayButton>
      <VoteNayButton onClick={action('Nay')}> Nay </VoteNayButton>
    </React.Fragment>
  ));
