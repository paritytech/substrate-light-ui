// Copyright 2018-2020 @paritytech/Nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { boolean, withKnobs } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';
import React from 'react';
import Dropdown from 'semantic-ui-react/dist/commonjs/modules/Dropdown';

import { Menu } from '../src';
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

storiesOf('Menu', module)
  .addDecorator(withKnobs)
  .addDecorator(withTheme)
  .add('with dropdown', () => (
    <Menu>
      <Dropdown
        options={dropdownValues}
        placeholder='click me!'
        selection={boolean('selection', true)}
        vertical={boolean('vertical', true)}
      />
    </Menu>
  ))
  .add('with multiple dropdowns', () => (
    <Menu>
      <Dropdown
        options={dropdownValues}
        placeholder='im first!'
        selection={boolean('selection', true)}
        vertical={boolean('vertical', true)}
      />
      <Dropdown
        options={dropdownValues}
        placeholder='me second!'
        selection={boolean('selection', true)}
        vertical={boolean('vertical', true)}
      />
    </Menu>
  ));
