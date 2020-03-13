// Copyright 2018-2020 @paritytech/Nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { boolean, withKnobs } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';
import React from 'react';
import Dropdown from 'semantic-ui-react/dist/commonjs/modules/Dropdown';
import styled from 'styled-components';

import {
  BlackBlock,
  NodesBlock,
  NodesConnector,
  NodeSelector,
} from '../src/Shared.styles';
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
  ))
  .add('connected dropdown nodes', () => {
    const X = styled(Dropdown)`
      &&& {
        background: black;
        color: white;
        border: 1px solid white;
      }
    `;
    return (
      <NodesBlock>
        <NodeSelector>
          <X
            defaultValue='Restore'
            placeholder='Select Node'
            fluid
            options={dropdownValues}
            selection={boolean('selection', true)}
            vertical={boolean('vertical', true)}
          />
        </NodeSelector>
        <NodesConnector />
        <NodeSelector>
          <X
            defaultValue='Restore'
            placeholder='Select Node'
            fluid
            options={dropdownValues}
            selection={boolean('selection', true)}
            vertical={boolean('vertical', true)}
          />
        </NodeSelector>
      </NodesBlock>
    );
  });
