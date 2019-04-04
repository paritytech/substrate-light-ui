// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import BN from 'bn.js';

import { DynamicSizeText } from './Shared.styles';

type Props = {
  balance?: BN,
  fontSize?: string
};

const PLACEHOLDER_BALANCE = 0;

export class BalanceDisplay extends React.PureComponent<Props> {
  render () {
    const { balance, fontSize } = this.props;

    return (
        <DynamicSizeText fontSize={fontSize}>
          Balance: { (balance && balance.toString(10)) || PLACEHOLDER_BALANCE }
        </DynamicSizeText>
    );
  }
}
