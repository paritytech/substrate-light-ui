// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Balance } from '@polkadot/types';
import React from 'react';

import { DynamicSizeText } from './Shared.styles';

export type BalanceDisplayProps = {
  balance?: Balance,
  fontSize?: string,
  tokenSymbol?: string
};

const PLACEHOLDER_BALANCE = new Balance(0);
const PLACEHOLDER_TOKEN_SYMBOL = 'UNIT';

export class BalanceDisplay extends React.PureComponent<BalanceDisplayProps> {
  static defaultProps = {
    balance: PLACEHOLDER_BALANCE,
    tokenSymbol: PLACEHOLDER_TOKEN_SYMBOL
  };

  render () {
    const { balance, fontSize, tokenSymbol } = this.props;

    return (
      <DynamicSizeText fontSize={fontSize}>
        Balance: {(balance!.toString(10))} {tokenSymbol}
      </DynamicSizeText>
    );
  }
}
