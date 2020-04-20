// Copyright 2018-2020 @paritytech/Nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { text, withKnobs } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';
import React from 'react';

import { NavHeader } from '../src';
import { withTheme } from './customDecorators';

storiesOf('Header', module)
  .addDecorator(withKnobs)
  .addDecorator(withTheme)
  .add('empty', () => <NavHeader />)
  .add('with header', () => <NavHeader siteTitle={text('title', 'Nomidot')} />);