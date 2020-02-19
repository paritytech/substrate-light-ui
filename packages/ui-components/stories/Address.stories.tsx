// Copyright 2018-2020 @paritytech/Nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { text, withKnobs } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';
import React from 'react';

import { Address } from '../src/Address';
import { withTheme } from './customDecorators';

storiesOf('Address Segment', module)
  .addDecorator(withKnobs)
  .addDecorator(withTheme)
  .add('with address', () => (
    <Address
      address={text(
        'address',
        'ExuzF7kjvyUsk6TMH4MhKA4AE7DY6NCts4SDj9Q3HS1dP5W'
      )}
    />
  ));
