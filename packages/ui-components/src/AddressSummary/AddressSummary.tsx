// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import IdentityIcon from '@polkadot/ui-identicon';
import { AccountId, AccountIndex, Address } from '@polkadot/types';
import BN from 'bn.js';

import { Name, Stacked, StackedHorizontal } from '../Shared.styles';
import BalanceDisplay from '../Balance';

type OrientationTypes = 'horizontal' | 'vertical';
type SizeTypes = 'tiny' | 'small' | 'medium' | 'large';
type SummaryStyles = {
  identiconSize: number,
  nameSize: number
};

type Props = {
  address?: string | AccountId | AccountIndex | Address,
  balance?: BN,
  name?: string,
  orientation?: OrientationTypes,
  size?: SizeTypes
};

const PLACEHOLDER_NAME = 'Account 1';

export class AddressSummary extends React.PureComponent<Props> {
  render () {
    const { address, balance, name, orientation = 'vertical', size = 'medium' } = this.props;
    let styles: SummaryStyles;

    switch (size) {
      case 'tiny':
        styles = { identiconSize: 16, nameSize: 14 };
        break;
      case 'small':
        styles = { identiconSize: 32, nameSize: 18 };
        break;
      case 'medium':
        styles = { identiconSize: 64, nameSize: 22 };
        break;
      case 'large':
        styles = { identiconSize: 128, nameSize: 26 };
        break;
      default:
        break;
    }

    if (orientation === 'vertical') {
      return (
          <Stacked>
            {
                address && <IdentityIcon value={address as string} theme={'substrate'} size={styles.identiconSize} />
            }
                <Name fontSize={styles.nameSize}> { name || PLACEHOLDER_NAME } </Name>
                <BalanceDisplay balance={balance} address={address} />
          </Stacked>
      );
    } else {
      return (
          <StackedHorizontal justify='space-around'>
            {
              address && <IdentityIcon value={address as string} theme={'substrate'} size={styles.identiconSize} />
            }
            <Name fontSize={styles.nameSize}> { name || PLACEHOLDER_NAME } </Name>
            <BalanceDisplay balance={balance} address={address} />
          </StackedHorizontal>
      );
    }
  }
}
