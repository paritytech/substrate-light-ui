// Copyright 2018-2020 @paritytech/Nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { boolean, withKnobs } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';
import React from 'react';
import Dropdown from 'semantic-ui-react/dist/commonjs/modules/Dropdown';

import { withTheme } from './customDecorators';

const dropdownValues = [
  {
    key: 'Edit',
    text: 'Edit',
    value: 'Edit',
  },
  {
    key: 'Create',
    text: 'Create',
    value: 'Create',
  },
  {
    key: 'Restore',
    text: 'Restore',
    value: 'Restore',
  },
];

storiesOf('Dropdown', module)
  .addDecorator(withKnobs)
  .addDecorator(withTheme)
  .add('dropdown', () => (
    <Dropdown
      options={dropdownValues}
      placeholder='click me!'
      selection={boolean('selection', true)}
      vertical={boolean('vertical', true)}
    />
  ));
