// Copyright 2018-2020 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { SystemContext } from '@substrate/context';
import { StyledNavButton } from '@substrate/ui-components';
import React, { useContext } from 'react';

import { TxStatus } from './TxStatus';

interface Props {
  amount: string;
  recipient: string;
  sender: string;
  tip: string;
  txStatus: TxStatus;
}

export function TxDetails(props: Props): React.ReactElement {
  const { amount, recipient, sender, tip, txStatus } = props;

  const { chain, properties } = useContext(SystemContext);

  return (
    <>
      <h3>Transaction Details</h3>
      <div>Network: {chain.toString()}</div>
      <div>From: {sender}</div>
      <div>To: {recipient}</div>

      <div>
        Amount: {amount} {properties.tokenSymbol.unwrapOr('UNIT').toString()}
      </div>
      <div>
        Tip: {tip || 0} {properties.tokenSymbol.unwrapOr('UNIT').toString()}
      </div>
      <div>
        Fees: {'fees'} {properties.tokenSymbol.unwrapOr('UNIT').toString()}
      </div>
      <div>
        Total: {'total'} {properties.tokenSymbol.unwrapOr('UNIT').toString()}
      </div>

      {/* Submit logic is handled by form in Transfer component */}
      <StyledNavButton disabled={txStatus !== 'validated'} type='submit'>
        Submit Transaction
      </StyledNavButton>
    </>
  );
}
