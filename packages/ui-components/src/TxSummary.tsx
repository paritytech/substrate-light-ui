// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import IdentityIcon from '@polkadot/react-identicon';
import BN from 'bn.js';
import React from 'react';

import { DEFAULT_TOKEN_SYMBOL, Margin, StackedHorizontal } from './';

type TxSummaryProps = {
  amount: BN;
  methodCall: string;
  recipientAddress?: string;
  senderAddress: string;
  tokenSymbol?: string;
};

function smallIcon (address: string): React.ReactElement {
  return <Margin as='span' left='small' right='small' top='small'>
    <IdentityIcon theme='substrate' size={16} value={address} />
  </Margin>;
}

export function TxSummary ({
  amount,
  methodCall,
  recipientAddress,
  senderAddress,
  tokenSymbol = DEFAULT_TOKEN_SYMBOL
}: TxSummaryProps): React.ReactElement {
  return (
    <StackedHorizontal>
      {methodCall} {amount.toString()} {tokenSymbol} from
      {smallIcon(senderAddress)}
      {recipientAddress && (
        <React.Fragment>to {smallIcon(recipientAddress)}</React.Fragment>
      )}
    </StackedHorizontal>
  );
}
