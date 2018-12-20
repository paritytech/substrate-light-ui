// Copyright 2017-2018 @polkadot/light-apps authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import IdentityIcon from '@polkadot/ui-identicon';
import { AccountId, AccountIndex, Address } from '@polkadot/types';
import BN from 'bn.js';

import { Name, Stacked } from '../Shared.styles';
import BalanceDisplay from '../Balance';

type Props = {
  address?: string | AccountId | AccountIndex | Address,
  balance?: BN,
  name?: string
};

const PLACEHOLDER_NAME = 'Account 1';

export class AddressSummary extends React.PureComponent<Props> {
  render () {
    const { address, balance, name } = this.props;

    return (
      <Stacked>
        <IdentityIcon value={address as string} theme={'substrate'} size={64} />
        <Name> { name || PLACEHOLDER_NAME } </Name>
        <BalanceDisplay balance={balance} address={address} />
      </Stacked>
    );
  }
}
