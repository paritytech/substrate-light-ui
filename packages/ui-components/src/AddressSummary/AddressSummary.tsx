// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import IdentityIcon from '@polkadot/ui-identicon';
import { AccountId, AccountIndex, Address } from '@polkadot/types';

import BN from 'bn.js';
import React from 'react';

import { Name, Stacked, StackedHorizontal } from '../Shared.styles';
import BalanceDisplay from '../Balance';

type OrientationTypes = 'horizontal' | 'vertical';
type SizeTypes = 'tiny' | 'small' | 'medium' | 'large';
type SummaryStyles = {
  identiconSize: number,
  nameSize: string
};

type Props = {
  address?: string | AccountId | AccountIndex | Address,
  balance?: BN,
  name?: string,
  orientation?: OrientationTypes,
  size?: SizeTypes
};

const PLACEHOLDER_NAME = 'No Name';
const PLACEHOLDER_ADDRESS = '5'.padEnd(16, 'x');

export class AddressSummary extends React.PureComponent<Props> {
  render () {
    const { address, balance, name, orientation = 'vertical', size = 'medium' } = this.props;
    let styles: SummaryStyles = { identiconSize: 16, nameSize: '14px' };

    switch (size) {
      case 'tiny':
        styles = { identiconSize: 16, nameSize: '14px' };
        break;
      case 'small':
        styles = { identiconSize: 32, nameSize: '18px' };
        break;
      case 'medium':
        styles = { identiconSize: 64, nameSize: '22px' };
        break;
      case 'large':
        styles = { identiconSize: 128, nameSize: '26px' };
        break;
      default:
        break;
    }

    if (orientation === 'vertical') {
      return (
          <Stacked>
            {
              <IdentityIcon value={address as string || PLACEHOLDER_ADDRESS} theme={'substrate'} size={styles.identiconSize} />
            }
                <Name fontSize={styles.nameSize}> { name || PLACEHOLDER_NAME } </Name>
                <BalanceDisplay balance={balance} />
          </Stacked>
      );
    } else {
      return (
          <StackedHorizontal justify='space-around'>
            {
              <IdentityIcon value={address as string || PLACEHOLDER_ADDRESS} theme={'substrate'} size={styles.identiconSize} />
            }
            <Name fontSize={styles.nameSize}> { name || PLACEHOLDER_NAME } </Name>
            <BalanceDisplay balance={balance} />
          </StackedHorizontal>
      );
    }
  }
}
