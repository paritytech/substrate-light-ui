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

export const InputTransferFundsStory = (): React.ReactElement => {
  return (
    <>
      <Input
        fluid
        textLabel='Amount'
        onChange={action('typed')}
        placeholder='0'
        size='massive'
        type='number'
      />
      <Input fluid textLabel='Tip' type='number' placeholder='0' />
      <InputAddressStory />
    </>
  );
};

storiesOf('Input', module)
  .addDecorator(withKnobs)
  .addDecorator(withTheme)
  .add('Input', () => (
    <Input
      borderless={boolean('borderless', false)}
      disabled={boolean('disabled', false)}
      focus={boolean('focus', false)}
      fluid={boolean('fluid', true)}
      inverted={boolean('inverted', false)}
      icon={object('icon', { name: 'search', link: true })}
      textLabel={text('textLabel', 'Amount')}
      onChange={action('typed')}
      placeholder='placeholder...'
      size={select('size', sizes, 'small')}
      type={select('type', inputTypes, 'text')}
      wrapClass={text('wrapCLass', 'mb2')}
    />
  ))
  .add('Input | With Label', () => (
    <Input
      label='label'
      labelPosition='left'
      textLabel='Input with'
      onChange={action('typed')}
      placeholder='placeholder...'
    />
  ))
  .add('Input | Mnemonic Word', () => {
    return (
      <Input
        wrapClass={text('wrapCLass', 'code red')}
        textLabel='1'
        value={text('value', 'word')}
        borderless={true}
        fake={boolean('fake', true)}
      />
    );
  })
  .add('Input | Transfer Funds', () => <InputTransferFundsStory />);
