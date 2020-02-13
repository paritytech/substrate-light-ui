// Copyright 2018-2020 @paritytech/Nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { action } from '@storybook/addon-actions';
import { select, withKnobs } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';
import React from 'react';

import { Fab } from '../src';
import { withTheme } from './customDecorators';

storiesOf('Fab', module)
  .addDecorator(withKnobs)
  .addDecorator(withTheme)
  .add('Fab', () => (
    <Fab
      onClick={action('clicked')}
      type={select('fab type', ['add', 'send'], 'send')}
    />
  ));
