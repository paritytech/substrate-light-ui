// Copyright 2018-2020 @paritytech/Nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { action } from '@storybook/addon-actions';
import { withKnobs } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';
import React from 'react';

import { InputFile } from '../src';
import { withTheme } from './customDecorators';

storiesOf('Input File', module)
  .addDecorator(withKnobs)
  .addDecorator(withTheme)
  .add('no props', () => <InputFile />)
  .add('with props', () => <InputFile onChange={action('file dropped')} />);
