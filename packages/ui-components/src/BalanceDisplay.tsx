// Copyright 2018-2020 @paritytech/Nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import {
  DeriveBalancesAll,
  DeriveStakingAccount,
  DeriveUnlocking,
} from '@polkadot/api-derive/types';
import { formatBalance, formatNumber } from '@polkadot/util';
import React from 'react';
import Loader from 'semantic-ui-react/dist/commonjs/elements/Loader';

import { Icon, Layout, NavButton, Paragraph } from './index';
import { OrientationType } from './types';

export type BalanceDisplayProps = {
  allBalances?: DeriveBalancesAll;
  allStaking?: DeriveStakingAccount;
  detailed?: boolean;
  handleRedeem?: (address: string) => void;
  orientation?: 'horizontal' | 'vertical';
};

const defaultProps = {
  detailed: false,
  orientation: 'vertical' as OrientationType,
};

// FIXME: https://github.com/paritytech/substrate-light-ui/issues/471
export function BalanceDisplay(
  props: BalanceDisplayProps = defaultProps
): React.ReactElement {
  const { allBalances, allStaking, detailed, handleRedeem } = props;

  const renderRedeemButton = (): React.ReactElement | null => {
    return allStaking && allStaking.controllerId ? (
      <NavButton
        negative
        onClick={(): void =>
          allStaking &&
          allStaking.controllerId &&
          handleRedeem &&
          handleRedeem(allStaking.controllerId.toString())
        }
      >
        <Icon name='lock' />
        Redeem Funds
      </NavButton>
    ) : null;
  };

  const renderUnlocking = (): React.ReactElement | null => {
    return allStaking && allStaking.unlocking ? (
      <>
        {allStaking.unlocking.map(
          ({ remainingEras, value }: DeriveUnlocking, index: number) => (
            <div key={index}>
              <Paragraph faded>
                Unbonded Amount: {formatBalance(value)}
              </Paragraph>
              <Paragraph faded>
                Eras remaining: {remainingEras.toNumber()}
              </Paragraph>
            </div>
          )
        )}
      </>
    ) : null;
  };

  const renderDetailedBalances = (): React.ReactElement => {
    if (!allBalances) {
      return <></>;
    }

    const { availableBalance, lockedBalance, reservedBalance } = allBalances;

    return (
      <>
        <hr />
        <Layout className='flex-column items-stretch'>
          <Layout>
            <b>Available:</b>
            {formatBalance(availableBalance)}
          </Layout>
          <Layout className='justify-between'>
            {allStaking && allStaking.redeemable && (
              <>
                <b>Redeemable:</b>
                {formatBalance(allStaking.redeemable)}
                {allStaking.redeemable.gtn(0) && renderRedeemButton()}
              </>
            )}
          </Layout>
          <Layout className='justify-between'>
            <b>Reserved:</b>
            {reservedBalance && (
              <Paragraph faded>{formatBalance(reservedBalance)}</Paragraph>
            )}
          </Layout>
          <Layout className='justify-between'>
            <b>Locked:</b>
            {lockedBalance && formatBalance(lockedBalance)}
          </Layout>
          {renderUnlocking()}
        </Layout>
      </>
    );
  };

  return (
    <>
      {allBalances ? (
        <>
          <Paragraph>
            <strong>Total Balance:</strong>{' '}
            {allBalances.freeBalance && formatBalance(allBalances.freeBalance)}
          </Paragraph>
          <Paragraph faded>
            Transactions: {formatNumber(allBalances.accountNonce)}{' '}
          </Paragraph>
        </>
      ) : (
        <Loader active inline />
      )}
      {detailed && allBalances && renderDetailedBalances()}
    </>
  );
}
