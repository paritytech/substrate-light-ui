// Copyright 2017-2018 @polkadot/light-apps authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import { AccountId, AccountIndex, Address } from '@polkadot/types';
import BN from 'bn.js';

import { Stacked } from './Shared.styles';
import toShortAddress from './util/toShortAddress';

type Props = {
  address: string | AccountId | AccountIndex | Address,
  balance: BN
};

export default class BalanceDisplay extends React.PureComponent<Props> {
  render () {
    const { address, balance } = this.props;

    return (
      <Stacked>
        <div>{ toShortAddress(address) }</div>
        <div> Balance: { balance.toString(10) } </div>
      </Stacked>
    );
  }
}
