// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import PolkadotInputAddress from '@polkadot/ui-app/InputAddress';
import styled from 'styled-components';
import { FadedText, StackedHorizontal } from '@substrate/ui-components';

import { NodeStatusProps } from './types';

// These styles are the same as if we added `fluid={true}` prop. Unfortunately
// PolkadotInputAddress doesn't pass down props to SUI components.
export const InputAddress = styled(PolkadotInputAddress)`
  .dropdown {
    min-width: 0;
    width: 100%;
  }
`;

const Circle = styled.span`
  background-color: ${props => props.color || 'red'};
  height: '25p';
  width: '25px';
  border-radius: 50%;
  display: inline-block;
`;

export const NodeStatus = ({ isSyncing }: NodeStatusProps) => (
  <StackedHorizontal>
    <FadedText> Node Status: </FadedText>
    { isSyncing ? <Circle color='red' /> : <Circle color='green' /> }
  </StackedHorizontal>
);
