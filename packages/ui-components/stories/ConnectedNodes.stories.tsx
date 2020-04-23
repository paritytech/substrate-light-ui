// Copyright 2018-2020 @paritytech/Nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { boolean, text, withKnobs } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';
import React from 'react';

import { ConnectedNodes } from '../src';
import { withTheme } from './customDecorators';

storiesOf('ConnectedNodes', module)
  .addDecorator(withKnobs)
  .addDecorator(withTheme)
  .add('connected nodes', () => (
    <ConnectedNodes
      fluid={boolean('fluid', true)}
      className={text('className', '')}
      nodesClassName={text('nodeClassName', 'justify-around pv2 ph3')}
      connectorClassName={text('connectorClassName', '')}
    >
      <span>Node A</span>
      <span>Node B</span>
    </ConnectedNodes>
  ));
