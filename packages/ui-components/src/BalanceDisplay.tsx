// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Balance } from '@polkadot/types';
import { DerivedBalances, DerivedStaking } from '@polkadot/api-derive/types';
import React from 'react';

import { FontSize, FontWeight } from './types';
import { DynamicSizeText, FadedText, Stacked } from './Shared.styles';

export type BalanceDisplayProps = {
  allBalances?: DerivedBalances,
  allStaking?: DerivedStaking,
  detailed?: boolean,
  fontSize?: FontSize,
  fontWeight?: FontWeight,
  tokenSymbol?: string
};

const PLACEHOLDER_BALANCE = new Balance(0);
const PLACEHOLDER_TOKEN_SYMBOL = 'UNIT';
const defaultProps = {
  detailed: false,
  fontSize: 'large' as FontSize,
  tokenSymbol: PLACEHOLDER_TOKEN_SYMBOL
};

export function BalanceDisplay (props: BalanceDisplayProps = defaultProps) {
  const { allBalances, allStaking, detailed, fontSize, fontWeight, tokenSymbol } = props;

  const renderDetailedBalances = () => {
    const { availableBalance, lockedBalance, reservedBalance } = allBalances!;

    return (
      <React.Fragment>
        <span><b>Available:</b> <FadedText>{availableBalance.toString(5) || PLACEHOLDER_BALANCE.toString()}</FadedText></span>
        <span><b>Redeemable:</b> <FadedText>{allStaking && allStaking.redeemable && allStaking.redeemable.toString(5) || PLACEHOLDER_BALANCE.toString()}</FadedText></span>
        <span><b>Reserved:</b><FadedText>{reservedBalance.toString(5) || PLACEHOLDER_BALANCE.toString()}</FadedText></span>
        <span><b>Locked:</b><FadedText>{lockedBalance.toString(5) || PLACEHOLDER_BALANCE.toString()}</FadedText></span>
      </React.Fragment>
    )
  }

  return (
    <Stacked>
      <DynamicSizeText fontSize={fontSize} fontWeight={fontWeight}>
        Balance {(allBalances && allBalances.freeBalance && allBalances.freeBalance.toString(10))} {tokenSymbol}
      </DynamicSizeText>
      {
        detailed
          && allBalances
          && renderDetailedBalances()
      }
    </Stacked>
  );
}
