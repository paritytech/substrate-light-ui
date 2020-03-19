// Copyright 2018-2020 @paritytech/Nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import { boolean, withKnobs } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';
import { withTheme } from './customDecorators';

import { MeasureApp } from '../src';
import { Menu } from '../src';

export const MenuTabsStory = () => {
  const tabs = boolean('tabs', true);
  return (
    <Menu borderless tabs={tabs}>
      <MeasureApp className='items-center'>
        <Menu.Item active={true}>Accounts</Menu.Item>
        <Menu.Item>Send Funds</Menu.Item>
      </MeasureApp>
    </Menu>
  )
}

storiesOf('Menu', module)
  .addDecorator(withKnobs)
  .addDecorator(withTheme)
  .add('Menu Tabs', () => (
   <MenuTabsStory />
));
