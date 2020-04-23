// Copyright 2018-2020 @paritytech/Nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { boolean, text, withKnobs } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';
import React from 'react';

import {
  Circle,
  ConnectedNodes,
  Container,
  Dropdown,
  Layout,
  Menu,
  polkadotOfficialTheme,
} from '../src';
import { withTheme } from './customDecorators';

export const TopBarStory = (): React.ReactElement => {
  const nodeOptions = [
    {
      text: 'Kusama CC3 (Light Client)',
      value: 'Kusama CC3 (Light Client)',
    },
    {
      text: 'Westend (Light Client)',
      value: 'Westend Light Client)',
    },
    {
      text: 'Kusama CC3 (Remote Node)',
      value: 'Kusama CC3 (Remote Node)',
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
          defaultValue='Kusama CC3 (Light Client)'
        />
      </Menu>
    );
  }
  function NetworkStatus(): React.ReactElement {
    return (
      <Layout className='justify-between ph3 w-100'>
        <Circle
          wrapClass='w-20'
          fill={polkadotOfficialTheme.green}
          radius={10}
        />
        <span className='mh2 code truncate'>NETWORK</span>
        <span className='dn db-l w-30 truncate f7 silver'>
          Block #143873821739
        </span>
      </Layout>
    );
  }
  function RenderLogo(): React.ReactElement {
    // TODO logo graphics in ConnectedNode / not
    return <div className='w-50 mr3'>Lichen</div>;
  }

  return (
    <Layout className='bg-black-90 white pv2 mb4'>
      <Container>
        <Layout className='w-100 justify-between'>
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
        </Layout>
      </Container>
    </Layout>
  );
};

storiesOf('ConnectedNodes/TopBar', module)
  .addDecorator(withKnobs)
  .addDecorator(withTheme)
  .add('providerHealth', () => <TopBarStory />);
