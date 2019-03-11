// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import { storiesOf } from '@storybook/react';
import { object, select, text, withKnobs } from '@storybook/addon-knobs/react';

import WalletCard from '../src/WalletCard';

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
  .add('empty props', () => (
    <WalletCard />
  ))
  .add('with headers', () => (
    <WalletCard
      header={text('header', 'Simple Header For This Card')}
      subheader={text('subheader', 'And this is a subheader')}
      overflow={select('overflow', overflowOptions)}/>
  ));
