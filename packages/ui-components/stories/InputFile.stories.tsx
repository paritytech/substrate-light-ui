// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { select, text, withKnobs } from '@storybook/addon-knobs';

import { withTheme } from './customDecorators';
import { InputFile } from '../src';

const fileTypes = ['text/plain', 'application/json', '.csv', '.pdf'];

storiesOf('Input File', module)
  .addDecorator(withKnobs)
  .addDecorator(withTheme)
  .add('no props', () => (
    <InputFile />
  ))
  .add('with props', () => (
    <InputFile
      accept={select('accept', fileTypes, 'text/plain')}
      onChange={action('file dropped')}
      placeholder={text('placeholder', 'Drop something here...')}/>
  ));
