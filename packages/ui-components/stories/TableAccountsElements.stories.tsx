// Copyright 2018-2020 @paritytech/Nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { boolean, text, withKnobs } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';
import React from 'react';

import { TableCellAddress } from '../src/TableCellAddress';
import { TableRowAccount } from '../src/TableRowAccount';
import { withTheme } from './customDecorators';

storiesOf('TableAccounts/Elements', module)
  .addDecorator(withKnobs)
  .addDecorator(withTheme)
  .add('TableCellAddress', () => <TableCellAddress />)
  .add('TableRowAccount', () => <TableRowAccount />);
