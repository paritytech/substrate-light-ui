// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Margin, StackedHorizontal } from '@substrate/ui-components';
import React from 'react';

import { BlockCounterProps, NodeStatusProps } from './types';

const Circle = (fill: string) =>
  <svg height='10' width='10'>
    <circle cx='5' cy='5' r='5' fill={fill} />
  </svg>;

const GreenCircle = () => Circle('#79c879');
const RedCircle = () => Circle('#ff0000');

export const BlockCounter = ({ blockNumber, chainName }: BlockCounterProps) => (
  <p> {chainName && chainName.toString()} #: {blockNumber && blockNumber.toString()} </p>
);

export const NodeStatus = ({ isSyncing }: NodeStatusProps) => (
  <StackedHorizontal>
    {isSyncing.eq(true) ? <RedCircle /> : <GreenCircle />}
    <Margin left='small' />
    <p> Status: {isSyncing.eq(true) ? 'Syncing' : 'Synced'} </p>
  </StackedHorizontal>
);
