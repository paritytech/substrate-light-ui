// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import { storiesOf } from '@storybook/react';
import { object, select, text, withKnobs } from '@storybook/addon-knobs';

import { withMemoryRouter, withTheme } from './customDecorators';
import { Input, MarginTop, NavButton, NavLink, WalletCard } from '../src';

const overflowOptions = [
  'none',
  'auto',
  'ellipsis',
  'hidden',
  'scroll',
  'visible'
];

storiesOf('Wallet Card', module)
  .addDecorator(withKnobs)
  .addDecorator(withMemoryRouter)
  .addDecorator(withTheme)
  .add('empty props', () => (
    <WalletCard />
  ))
  .add('with headers', () => (
    <WalletCard
      header={text('header', 'Simple Header For This Card')}
      subheader={text('subheader', 'And this is a subheader')}
      overflow={select('overflow', overflowOptions)} />
  ))
  .add('with children', () => (
    <WalletCard
      header={text('header', 'Simple Header For This Card')}
      subheader={text('subheader', 'And this is a subheader')}
      overflow={select('overflow', overflowOptions)}>
      <Input
        label={text('label', 'input something')}
        size='huge'
      />
      <MarginTop />
      <NavButton value={text('button text', 'Submit')}/>
      <MarginTop />
      <NavLink to={text('to', 'there')} value={text('link text', 'Link')}/>
    </WalletCard>
  ));
