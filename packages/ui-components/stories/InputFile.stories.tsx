// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { withKnobs } from '@storybook/addon-knobs';

import { withTheme } from './customDecorators';
import { InputFile } from '../src';

storiesOf('Input File', module)
  .addDecorator(withKnobs)
  .addDecorator(withTheme)
  .add('no props', () => (
    <InputFile />
  ))
  .add('with props', () => (
    <InputFile
      onChange={action('file dropped')} />
  ));
