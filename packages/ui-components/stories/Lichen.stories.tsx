// Copyright 2018-2020 @paritytech/Nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { withKnobs } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';
import React from 'react';
import { Button, Icon } from 'semantic-ui-react';

import { MeasureApp } from '../src';
import { withTheme } from './customDecorators';
import { MenuTabsStory } from './Menu.stories';
import { TableAccountsStory } from './TableAccounts.stories';
import { TopBarStory } from './TopBar.stories';

// TODO:
// component: button.substrate
// component: menu.substrate

storiesOf('Apps/Lichen', module)
  .addDecorator(withKnobs)
  .addDecorator(withTheme)
  .add('start', () => (
    <>
      <MenuTabsStory />
      <TopBarStory />
      <MeasureApp className='flex-column'>
        <div className='flex items-center mb2'>
          <h2 className='inline-flex mr3 mb0'> Your Accounts </h2>
          <Button basic icon labelPosition='right'>
            <Icon name='plus' />
            Add New
          </Button>
        </div>
        <TableAccountsStory />
      </MeasureApp>
    </>
  ));
