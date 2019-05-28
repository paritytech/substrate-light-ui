// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AccountId, Balance, Option } from '@polkadot/types';
import React from 'react';

import { FontSize, FontWeight } from './types';
import { DynamicSizeText, FadedText, Stacked } from './Shared.styles';
import { Observable } from 'rxjs';

export type BalanceDisplayProps = {
  freeBalance?: Balance,
  fontSize?: FontSize,
  fontWeight?: FontWeight,
  reservedBalance?: Balance,
  lockedBalance?: Balance,
  tokenSymbol?: string,
  votingBalance?: Balance
};

const PLACEHOLDER_BALANCE = new Balance(0);
const PLACEHOLDER_TOKEN_SYMBOL = 'UNIT';
const defaultProps = {
  balance: PLACEHOLDER_BALANCE,
  fontSize: 'large' as FontSize,
  tokenSymbol: PLACEHOLDER_TOKEN_SYMBOL
};

export function BalanceDisplay (props: BalanceDisplayProps = defaultProps) {
  const { freeBalance, lockedBalance, fontSize, fontWeight, reservedBalance, votingBalance, tokenSymbol } = props;

  return (
    <Stacked>
      <DynamicSizeText fontSize={fontSize} fontWeight={fontWeight}>
        Balance {(freeBalance!.toString(10))} {tokenSymbol}
      </DynamicSizeText>

      {reservedBalance && <FadedText>{reservedBalance.toString(5)}</FadedText>}
      {lockedBalance && <FadedText>{lockedBalance.toString(5)}</FadedText>}
      {votingBalance && <FadedText>{votingBalance.toString(5)}</FadedText>}
    </Stacked>
  );
}
