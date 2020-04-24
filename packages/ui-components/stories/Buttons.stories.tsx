// Copyright 2018-2020 @paritytech/Nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { action } from '@storybook/addon-actions';
import { boolean, select, text, withKnobs } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';
import React from 'react';

import { Button } from '../src/Button';
import { NavButton } from '../src/NavButton';
import { VoteButton } from '../src/VoteButton';
import { withTheme } from './customDecorators';

storiesOf('Button', module)
  .addDecorator(withKnobs)
  .addDecorator(withTheme)
  .add('Button', () => <Button> Button</Button>)
  .add('NavButton', () => {
    const className = text('className', '');
    const negative = boolean('negative', false);
    const disabled = boolean('disabled', false);
    const onClick = action('clicked');

    return (
      <NavButton
        onClick={onClick}
        negative={negative}
        className={className}
        disabled={disabled}
      >
        {text('children', 'Click Me!')}
      </NavButton>
    );
  })
  .add('VoteButton', () => {
    const className = text('className', '');
    const vote = select('vote', ['yay', 'nay'], 'yay');
    const onClick = action('Vote');

    return (
      <VoteButton onClick={onClick} className={className} vote={vote}>
        {text('children', 'Click Me!')}
      </VoteButton>
    );
  });
