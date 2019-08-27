// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Circle, Margin, StackedHorizontal, SubHeader } from '@substrate/ui-components';
import React from 'react';

import { BlockCounterProps, NodeStatusProps } from './types';

const GREEN = '#79c879';
const RED = '#ff0000';

export const BlockCounter = ({ blockNumber, chainName }: BlockCounterProps) => (
  <React.Fragment>
    <SubHeader noMargin> {chainName && chainName.toString()} </SubHeader>
    <p> Block #: {blockNumber && blockNumber.toString()} </p>
  </React.Fragment>
);

export const NodeStatus = ({ isSyncing }: NodeStatusProps) => (
  <StackedHorizontal>
    {isSyncing.eq(true) ? <Circle fill={GREEN} /> : <Circle fill={RED} />}
    <Margin left='small' />
    <p> Status: {isSyncing.eq(true) ? 'Syncing' : 'Synced'} </p>
  </StackedHorizontal>
);
