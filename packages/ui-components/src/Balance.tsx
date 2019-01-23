// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import { AccountId, AccountIndex, Address } from '@polkadot/types';
import BN from 'bn.js';

import { Stacked, MarginTop } from './Shared.styles';
import toShortAddress from './util/toShortAddress';

type Props = {
  address?: string | AccountId | AccountIndex | Address,
  balance?: BN
};

const PLACEHOLDER_BALANCE = 0;
const PLACEHOLDER_ADDRESS = '5'.padEnd(16, 'x');

export default class BalanceDisplay extends React.PureComponent<Props> {
  render () {
    const { address, balance } = this.props;

    return (
      <Stacked>
        <MarginTop />
        <div>{ (address && toShortAddress(address)) || PLACEHOLDER_ADDRESS }</div>
        <div>Balance: { (balance && balance.toString(10)) || PLACEHOLDER_BALANCE }</div>
      </Stacked>
    );
  }
}
