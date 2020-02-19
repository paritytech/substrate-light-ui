// Copyright 2018-2020 @paritytech/Nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { select, text, withKnobs } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';
import React from 'react';

import { AddressSummary } from '../src/stateful/AddressSummary';
import {
  OrientationType,
  SizeType,
} from '../src/stateful/AddressSummary/types';
import { withApi, withTheme } from './customDecorators';

const orientations: Array<OrientationType> = ['horizontal', 'vertical'];
const sizes: Array<SizeType> = ['tiny', 'small', 'medium', 'large'];

storiesOf('Address Sumary', module)
  .addDecorator(withApi)
  .addDecorator(withKnobs)
  .addDecorator(withTheme)
  .add('summary', () => (
    <AddressSummary
      address={text(
        'address',
        'ExuzF7kjvyUsk6TMH4MhKA4AE7DY6NCts4SDj9Q3HS1dP5W'
      )}
      name={text('name', 'Joe Schmoe')}
      orientation={select('orientation', orientations, orientations[0])}
      size={select('size', sizes, sizes[0])}
    />
  ));
