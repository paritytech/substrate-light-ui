// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { select, text, withKnobs } from '@storybook/addon-knobs';

import { withMemoryRouter, withTheme } from './customDecorators';
import { Input, Margin, NavButton, NavLink, WalletCard } from '../src';

const overflowOptions = [
  'none',
  'auto',
  'ellipsis',
  'hidden',
  'scroll',
  'visible'
];

const sizes = ['mini', 'tiny', 'small', 'medium', 'large', 'big', 'huge', 'massive'];

storiesOf('Wallet Card', module)
  .addDecorator(withKnobs)
  .addDecorator(withMemoryRouter)
  .addDecorator(withTheme)
  .add('with props', () => (
    <WalletCard
      header={text('header', 'Simple Header For This Card')}
      subheader={text('subheader', 'And this is a subheader')}
      overflow={select('overflow', overflowOptions, 'auto')}>
      <Input
        label={text('label', 'input something')}
        onChange={action('typed')}
        size={select('size', sizes, 'tiny')}
      />
      <Margin top />
      <NavButton onClick={action('clicked')} value={text('button text', 'Submit')} />
      <Margin top />
      <NavLink onClick={action('clicked')} to={text('to', 'there')} value={text('link text', 'Link')} />
    </WalletCard>
  ));
