// Copyright 2018-2020 @paritytech/Nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { action } from '@storybook/addon-actions';
import {
  boolean,
  object,
  select,
  text,
  withKnobs,
} from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';
import React from 'react';
import { Select } from 'semantic-ui-react';

import { Input } from '../src';
import { SUIInputSize } from '../src/types';
import { withTheme } from './customDecorators';
import { InputAddressStory } from './InputAddress.stories';

//TODO
//input address

const inputTypes = ['number', 'password', 'text'];
const sizes: SUIInputSize[] = [
  'mini',
  'small',
  'large',
  'big',
  'huge',
  'massive',
];
const labelPositions: string[] = [
  'left',
  'right',
  'left corner',
  'right corner',
  null,
];

export const InputTransferFundsStory = () => {
  return (
    <>
      <Input
        textLabel='Amount'
        label='KSM'
        labelPosition='right'
        onChange={action('typed')}
        placeholder='0'
        size='massive'
        type='number'
      />
      <Input textLabel='To' />
      <InputAddressStory />
      <Input
        label='Tips Icon'
        labelPosition='right'
        textLabel='Tip'
        type='number'
        placeholder='0'
      />
    </>
  );
};

storiesOf('Input', module)
  .addDecorator(withKnobs)
  .addDecorator(withTheme)
  .add('Input', () => (
    <>
      <Input
        disabled={boolean('disabled', false)}
        focus={boolean('focus', false)}
        inverted={boolean('inverted', false)}
        icon={object('icon', { name: 'search', link: true })}
        textLabel={text('textLabel', 'Amount')}
        label={text('label', null)}
        labelPosition={select('labelPosition', labelPositions, null)}
        onChange={action('typed')}
        placeholder='placeholder...'
        size={select('size', sizes, 'small')}
        type={select('input type', inputTypes, 'text')}
        wrapClass={text('wrapCLass', 'mb2')}
      />
    </>
  ))
  .add('Input | Transfer Funds', () => <InputTransferFundsStory />);
