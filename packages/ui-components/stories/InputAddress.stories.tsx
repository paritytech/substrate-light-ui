// Copyright 2018-2020 @paritytech/Nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { action } from '@storybook/addon-actions';
import { text, withKnobs } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';
import React from 'react';

import { InputAddress } from '../src/InputAddress';
import { withTheme } from './customDecorators';

const SAMPLE_ACCOUNT = 'ExuzF7kjvyUsk6TMH4MhKA4AE7DY6NCts4SDj9Q3HS1dP5W';

storiesOf('InputAddress', module)
  .addDecorator(withKnobs)
  .addDecorator(withTheme)
  .add('input address', () => (
    <InputAddress
      accounts={{
        [SAMPLE_ACCOUNT]: {
          json: { address: SAMPLE_ACCOUNT, meta: {} },
          option: { key: 'foo', name: 'bar', value: 'baz' },
        },
      }}
      onChangeAddress={action('onChange clicked')}
      value={text('address', SAMPLE_ACCOUNT)}
    />
  ));
