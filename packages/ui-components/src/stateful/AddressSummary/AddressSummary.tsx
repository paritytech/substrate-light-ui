// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import IdentityIcon from '@polkadot/ui-identicon';
import React from 'react';

import { Balance } from '../Balance';
import { DynamicSizeText, Stacked, StackedHorizontal } from '../../Shared.styles';
import { OrientationType, SizeType } from './types';
import { FontSize } from '../../types';

type SummaryStyles = {
  identiconSize: number,
  fontSize: FontSize
};

type Props = {
  address?: string,
  name?: string | React.ReactNode,
  orientation?: OrientationType,
  size?: SizeType
};

const PLACEHOLDER_NAME = 'No Name';
const PLACEHOLDER_ADDRESS = '5'.padEnd(16, 'x');

export class AddressSummary extends React.PureComponent<Props> {
  render () {
    const { address, name, orientation = 'vertical', size = 'medium' } = this.props;
    let styles: SummaryStyles = { identiconSize: 16, fontSize: 'medium' };

    switch (size) {
      case 'tiny':
        styles = { identiconSize: 16, fontSize: 'medium' };
        break;
      case 'small':
        styles = { identiconSize: 32, fontSize: 'large' };
        break;
      case 'medium':
        styles = { identiconSize: 64, fontSize: 'big' };
        break;
      case 'large':
        styles = { identiconSize: 128, fontSize: 'big' };
        break;
      default:
    }

    if (orientation === 'vertical') {
      return (
        <Stacked>
          <IdentityIcon value={address as string || PLACEHOLDER_ADDRESS} theme={'substrate'} size={styles.identiconSize} />
          <DynamicSizeText fontSize={styles.fontSize}> {name || PLACEHOLDER_NAME} </DynamicSizeText>
          <Balance address={address} />
        </Stacked>
      );
    } else {
      return (
        <StackedHorizontal justifyContent='space-around'>
          <IdentityIcon value={address as string || PLACEHOLDER_ADDRESS} theme={'substrate'} size={styles.identiconSize} />
          <DynamicSizeText fontSize={styles.fontSize}> {name || PLACEHOLDER_NAME} </DynamicSizeText>
          <Balance address={address} />
        </StackedHorizontal>
      );
    }
  }
}
