// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { select, withKnobs } from '@storybook/addon-knobs';

import { withTheme } from './customDecorators';
import { Fab } from '../src';

storiesOf('Fab', module)
  .addDecorator(withKnobs)
  .addDecorator(withTheme)
  .add('Fab', () => (
    <Fab onClick={action('clicked')} type={select('fab type', ['add', 'send'], 'send')} />
  ));
