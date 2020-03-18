// Copyright 2018-2020 @paritytech/Nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { boolean, text, withKnobs } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';
import React from 'react';

import {
  BlackBlock,
  Circle,
  ConnectedNodes,
  Dropdown,
  Margin,
  Menu,
} from '../src';
import { withTheme } from './customDecorators';

storiesOf('Compaunds/TopBar', module)
  .addDecorator(withKnobs)
  .addDecorator(withTheme)
  .add('providerHealth', () => {
    const nodeOptions = [
      {
        text: 'Kusama CC3 (from extension Light Client)',
        value: 'Kusama CC3 (from extension Light Client)',
      },
      {
        text: 'Westend (from extension Light Client)',
        value: 'Westend (from extension Light Client)',
      },
      {
        text: 'Kusama CC3 (from centralized remote node)',
        value: 'Kusama CC3 (from centralized remote node)',
      },
    ];

    // TODO: these might need to be components
    function ChooseProvider(): React.ReactElement {
      return (
        <Menu compact inverted fluid>
          <Dropdown
            theme='dark'
            className='code justify-between'
            options={nodeOptions}
            placeholder='Select Node Option'
            fluid
            simple
            item
          />
        </Menu>
      );
    }
    function NetworkStatus(): React.ReactElement {
      return (
        <div className='flex items-center justify-between truncate ph3 w-100'>
          <Circle fill={'#79c879'} radius={10} />
          <Margin left='small' />
          <span className='mh1 truncate code'>NETWORK</span>
          <span className='db-l dn f7 silver truncate'>
            Block #143873821739
          </span>
        </div>
      );
    }
    function RenderLogo(): React.ReactElement {
      return <div className='w-50'>Lichen</div>;
    }

    return (
      <BlackBlock className='flex justify-center'>
        <div className='flex items-center mw9 relative w-100 pv2'>
          <RenderLogo />
          <ConnectedNodes
            fluid={boolean('fluid', true)}
            className={text('className', 'flex items-stretch w-100')}
            nodesClassName={text(
              'nodeClassName',
              'b--silver ba br2 flex w-100 justify-center'
            )}
            connectorClassName={text('connectorClassName', 'bb b--silver')}
          >
            <NetworkStatus />
            <ChooseProvider />
          </ConnectedNodes>
        </div>
      </BlackBlock>
    );
  });
