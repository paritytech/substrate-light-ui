// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DerivedBalances, DerivedStaking } from '@polkadot/api-derive/types';
import { formatBalance, formatNumber } from '@polkadot/util';
import React from 'react';
import Loader from 'semantic-ui-react/dist/commonjs/elements/Loader';

import { FontSize, FontWeight } from './types';
import { DynamicSizeText, FadedText, Stacked, StyledLinkButton } from './Shared.styles';
import { Icon } from './index';

export type BalanceDisplayProps = {
  allBalances?: DerivedBalances;
  allStaking?: DerivedStaking;
  detailed?: boolean;
  fontSize?: FontSize;
  fontWeight?: FontWeight;
  handleRedeem?: (address: string) => void;
};

const defaultProps = {
  detailed: false,
  fontSize: 'large' as FontSize
};

// FIXME: https://github.com/paritytech/substrate-light-ui/issues/471
export function BalanceDisplay (props: BalanceDisplayProps = defaultProps): React.ReactElement {
  const { allBalances, allStaking, detailed, fontSize, fontWeight, handleRedeem } = props;

  const renderRedeemButton = (): React.ReactElement | null => {
    return (allStaking && allStaking.controllerId
      ? (
        <StyledLinkButton onClick={(): void => allStaking && allStaking.controllerId && handleRedeem && handleRedeem(allStaking.controllerId.toString())}>
          <Icon name='lock' />
          Redeem Funds
        </StyledLinkButton>
      )
      : null);
  };

  const renderUnlocking = (): React.ReactElement | null => {
    return (
      allStaking && allStaking.unlocking
        ? (
          <>
            {allStaking.unlocking.map(({ remainingBlocks, value }, index) => (
              <div key={index}>
                <FadedText>Unbonded Amount: {formatBalance(value)}</FadedText>
                <FadedText> Blocks remaining: {remainingBlocks.toNumber()}</FadedText>
              </div>
            ))}
          </>
        )
        : null
    );
  };

  const renderDetailedBalances = (): React.ReactElement => {
    const { availableBalance, lockedBalance, reservedBalance } = allBalances!;

    return (
      <React.Fragment>
        <span><b>Available:</b> <FadedText>{formatBalance(availableBalance)}</FadedText></span>
        <span>
          {
            allStaking && allStaking.redeemable &&
            <Stacked>
              <b>Redeemable:</b>
              <FadedText>{formatBalance(allStaking.redeemable)}</FadedText>
              {allStaking.redeemable.gtn(0) && renderRedeemButton()}
            </Stacked>
          }
        </span>
        <span><b>Reserved:</b>{reservedBalance && <FadedText>{formatBalance(reservedBalance)}</FadedText>}</span>
        <span><b>Locked:</b>{lockedBalance && <FadedText>{formatBalance(lockedBalance)}</FadedText>}</span>
        {renderUnlocking()}
      </React.Fragment>
    );
  };

  return (
    <Stacked>
      {allBalances
        ? <React.Fragment>
          <DynamicSizeText fontSize={fontSize} fontWeight={fontWeight}>
            <strong>Total Balance:</strong> {allBalances.freeBalance && formatBalance(allBalances.freeBalance)}
          </DynamicSizeText>
          <FadedText>Transactions: {formatNumber(allBalances.accountNonce)} </FadedText>
        </React.Fragment>
        : <Loader active inline />
      }
      {
        detailed &&
        allBalances &&
        renderDetailedBalances()
      }
    </Stacked >
  );
}
