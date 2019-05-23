// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Balance } from '@polkadot/types';
import React from 'react';

import { FontSize, FontWeight } from './types';
import { DynamicSizeText } from './Shared.styles';

type BalanceDisplayProps = {
  balance?: Balance,
  fontSize?: FontSize,
  fontWeight?: FontWeight,
  tokenSymbol?: string
};

const PLACEHOLDER_BALANCE = new Balance(0);
const PLACEHOLDER_TOKEN_SYMBOL = 'UNIT';
const defaultProps = {
  balance: PLACEHOLDER_BALANCE,
  fontSize: 'large' as FontSize,
  tokenSymbol: PLACEHOLDER_TOKEN_SYMBOL
};

export function BalanceDisplay (props: BalanceDisplayProps = defaultProps) {
  const { balance, fontSize, fontWeight, tokenSymbol } = props;

  return (
    <DynamicSizeText fontSize={fontSize} fontWeight={fontWeight} >
      Balance: {(balance!.toString(10))} {tokenSymbol}
    </DynamicSizeText>
  );
}
