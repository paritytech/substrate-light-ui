// Copyright 2018-2020 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { SystemContext } from '@substrate/context';
import { StyledNavButton } from '@substrate/ui-components';
import React, { useContext } from 'react';

interface Props {
  amount: string;
  recipient: string;
  sender: string;
  tip: string;
}

export function TxDetails(props: Props): React.ReactElement {
  const { amount, recipient, sender, tip } = props;

  const { chain } = useContext(SystemContext);

  return (
    <>
      <h3>Transaction Details</h3>
      <div>Network: {chain.toString()}</div>
      <div>From: {sender}</div>
      <div>To: {recipient}</div>

      <div>Amount: {amount}</div>
      <div>Tip: {tip}</div>
      <div>Fees: {'fees'}</div>
      <div>Total: {'total'}</div>

      {/* Submit logic is handled by form in Transfer component */}
      <StyledNavButton type='submit'>Submit Transaction</StyledNavButton>
    </>
  );
}
