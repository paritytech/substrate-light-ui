// Copyright 2017-2018 @polkadot/light-apps authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import IdentityIcon from '@polkadot/ui-identicon';
import { AccountId, AccountIndex, Address, Balance } from '@polkadot/types';
import BN from 'bn.js';

import { Name, SquareAddressSummaryBlock } from './AddressSummary.styles';
import { Stacked } from '../Shared.styles';
import BalanceDisplay from '../Balance';

type Props = {
  address: string | AccountId | AccountIndex | Address,
  balance?: Balance | BN | number,
  name: string
};

export class AddressSummary extends React.PureComponent<Props> {
  render () {
    const { address, balance, name } = this.props;

    return (
      <SquareAddressSummaryBlock>
        <IdentityIcon value={address as string} theme={'substrate'} size={64} />

        <Stacked>
          <Name> { name } </Name>
          <BalanceDisplay balance={balance} address={address} />
        </Stacked>
      </SquareAddressSummaryBlock>
    );
  }
}
