// Copyright 2018-2020 @paritytech/Nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { boolean, select, text, withKnobs } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';
import React from 'react';

import { WrapperDiv } from '../src/index';
import { OrientationType } from '../src/stateful/AddressSummary/types';
import { Balance } from '../src/stateful/Balance';
import { withApi, withTheme } from './customDecorators';

const orientations: Array<OrientationType> = ['horizontal', 'vertical'];

storiesOf('Balance', module)
  .addDecorator(withApi)
  .addDecorator(withKnobs)
  .addDecorator(withTheme)
  .add('summary', () => (
    <WrapperDiv>
      <Balance
        address={text(
          'address',
          'ExuzF7kjvyUsk6TMH4MhKA4AE7DY6NCts4SDj9Q3HS1dP5W'
        )}
        detailed={boolean('detailed', false)}
        orientation={select('orientation', orientations, orientations[0])}
      />
    </WrapperDiv>
  ));
