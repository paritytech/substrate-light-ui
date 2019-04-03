// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import BN from 'bn.js';
import React from 'react';
import { storiesOf } from '@storybook/react';
import { object, select, text, withKnobs } from '@storybook/addon-knobs';

import { withTheme } from './customDecorators';
import { AddressSummary } from '../src/AddressSummary';
import { OrientationType, SizeType } from '../src/AddressSummary/types';

let orientations: Array<OrientationType> = ['horizontal', 'vertical'];
let sizes: Array<SizeType> = ['tiny', 'small', 'medium', 'large'];

storiesOf('Address Sumary', module)
  .addDecorator(withKnobs)
  .addDecorator(withTheme)
  .add('summary', () => (
    <AddressSummary
      address={text('address', '5GeJHN5EcUGPoa5pUwYkXjymoDVN1DJHsBR4UGX4XRAwKBVk')}
      balance={object('balance', new BN(123))}
      name={text('name', 'Joe Schmoe')}
      orientation={
        select('orientation', orientations, orientations[0])
      }
      size={
        select('size', sizes, sizes[0])
      }
    />
  ));
