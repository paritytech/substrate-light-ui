// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import IdentityIcon from '@polkadot/ui-identicon';
import BN from 'bn.js';
import React from 'react';

import { Margin, StackedHorizontal } from './';

type TxSummaryProps = {
  amount: BN
  recipientAddress: string,
  senderAddress: string,
  tokenSymbol?: string
};

export function TxSummary ({ amount, recipientAddress, senderAddress, tokenSymbol }: TxSummaryProps) {
  return (
    <StackedHorizontal>
      transfer {amount.toString()} {tokenSymbol || 'UNIT'} from
      <Margin as='span' left='small' right='small' top='small'>
        <IdentityIcon theme='substrate' size={16} value={senderAddress} />
      </Margin>
      to
      <Margin as='span' left='small' right='small' top='small'>
        <IdentityIcon theme='substrate' size={16} value={recipientAddress} />
      </Margin>
    </StackedHorizontal>
  );
}
