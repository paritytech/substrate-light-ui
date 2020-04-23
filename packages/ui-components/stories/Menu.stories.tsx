// Copyright 2018-2020 @paritytech/Nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { boolean, withKnobs } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';
import React from 'react';

import { Container } from '../src';
import { Menu } from '../src';
import { withTheme } from './customDecorators';

export const MenuTabsStory = (props: {
  activeItem?: string;
}): React.ReactElement => {
  const { activeItem = 'Accounts' } = props;
  const tabs = boolean('tabs', true);
  return (
    <Menu borderless tabs={tabs} size='large'>
      <Container className='items-center'>
        <Menu.Item active={activeItem === 'Accounts'}>Accounts</Menu.Item>
        <Menu.Item active={activeItem === 'Send Funds'}>Send Funds</Menu.Item>
      </Container>
    </Menu>
  );
};

storiesOf('Menu', module)
  .addDecorator(withKnobs)
  .addDecorator(withTheme)
  .add('Menu Tabs', () => <MenuTabsStory />);
