// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Balance } from '@polkadot/types';
import React from 'react';

import { FontSize, FontWeight } from './types';
import { DynamicSizeText, FadedText, Stacked } from './Shared.styles';

export type BalanceDisplayProps = {
  bondedBalance?: Balance
  freeBalance?: Balance,
  fontSize?: FontSize,
  fontWeight?: FontWeight,
  reservedBalance?: Balance,
  lockedBalance?: Balance,
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
  const { bondedBalance, freeBalance, lockedBalance, fontSize, fontWeight, reservedBalance, tokenSymbol } = props;

  return (
    <Stacked>
      <DynamicSizeText fontSize={fontSize} fontWeight={fontWeight}>
        Balance {(freeBalance && freeBalance.toString(10))} {tokenSymbol}
      </DynamicSizeText>

      {bondedBalance && <span><b>Bonded:</b> <FadedText>{bondedBalance.toString(5)}</FadedText></span>}
      {reservedBalance && <span><b>Reserved:</b><FadedText>{reservedBalance.toString(5)}</FadedText></span>}
      {lockedBalance && <span><b>Locked:</b><FadedText>{lockedBalance.toString(5)}</FadedText></span>}
    </Stacked>
  );
}
