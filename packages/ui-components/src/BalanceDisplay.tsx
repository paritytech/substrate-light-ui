// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Balance } from '@polkadot/types';
import { DerivedBalances, DerivedStaking } from '@polkadot/api-derive/types';
import { formatBalance, formatNumber } from '@polkadot/util';
import React from 'react';
import Loader from 'semantic-ui-react/dist/commonjs/elements/Loader';

import { FontSize, FontWeight } from './types';
import { DynamicSizeText, FadedText, Stacked, StyledLinkButton } from './Shared.styles';
import { Icon } from './index';

export type BalanceDisplayProps = {
  allBalances?: DerivedBalances,
  allStaking?: DerivedStaking,
  detailed?: boolean,
  fontSize?: FontSize,
  fontWeight?: FontWeight,
  handleRedeem?: (address: string) => void
};

const defaultProps = {
  detailed: false,
  fontSize: 'large' as FontSize
};

export function BalanceDisplay (props: BalanceDisplayProps = defaultProps) {
  const { allBalances, allStaking, detailed, fontSize, fontWeight, handleRedeem } = props;

  const renderDetailedBalances = () => {
    const { availableBalance, lockedBalance, reservedBalance } = allBalances!;

    return (
      <React.Fragment>
        <span><b>Available:</b> <FadedText>{formatBalance(availableBalance) || <Loader active inline size='mini' />}</FadedText></span>
        <span>
          <b>Redeemable:</b>
          <FadedText>
            {allStaking && allStaking.redeemable && formatBalance(allStaking.redeemable) || <Loader active inline size='mini' />}
          </FadedText>
          {allStaking && allStaking.redeemable && allStaking.redeemable.gtn(0) && renderRedeemButton()}
        </span>
        <span><b>Reserved:</b><FadedText>{formatBalance(reservedBalance) || <Loader active inline size='mini' />}</FadedText></span>
        <span><b>Locked:</b><FadedText>{formatBalance(lockedBalance) || <Loader active inline size='mini' />}</FadedText></span>
        {renderUnlocking()}
      </React.Fragment>
    );
  };

  const renderRedeemButton = () => {
    return (allStaking && allStaking.controllerId && (
      <StyledLinkButton onClick={() => handleRedeem && handleRedeem(allStaking.controllerId!.toString())}>
        <Icon name='lock' />
        Redeem Funds
      </StyledLinkButton>
    ));
  };

  const renderUnlocking = () => {
    return (
      allStaking &&
      allStaking.unlocking &&
      allStaking.unlocking.map(({ remainingBlocks, value }, index) => (
        <div key={index}>
          {formatBalance(value)}
          <Icon
            name='info circle'
            data-tip
            data-for={`unlocking-trigger-${index}`}
          />
          <FadedText> Blocks remaining: {remainingBlocks}</FadedText>
        </div>
      ))
    );
  };

  return (
    <Stacked>
      <DynamicSizeText fontSize={fontSize} fontWeight={fontWeight}>
        <span><b>Total Balance:</b> {(allBalances && allBalances.freeBalance && formatBalance(allBalances.freeBalance) || <Loader active inline size='mini' />)}</span>
        <FadedText>Transactions: {allBalances && formatNumber(allBalances.accountNonce) || <Loader active inline size='mini' />}</FadedText>
      </DynamicSizeText>
      {
        detailed
          && allBalances
          && renderDetailedBalances()
      }
    </Stacked>
  );
}
