// Copyright 2018-2020 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { handler, SystemContext } from '@substrate/context';
import { Input, NavButton } from '@substrate/ui-components';
import React, { useContext } from 'react';

import { assertIsDefined } from '../../../util/assert';
import { TxStatus } from './TxStatus';

interface Props {
  amount: string;
  password: string;
  recipient: string;
  sender: string;
  setPassword: React.Dispatch<React.SetStateAction<string>>;
  tip: string;
  txStatus: TxStatus;
}

export function TxDetails(props: Props): React.ReactElement {
  const {
    amount,
    password,
    recipient,
    sender,
    setPassword,
    tip,
    txStatus,
  } = props;

  const { chain, properties } = useContext(SystemContext);

  assertIsDefined(chain, "We're inside SystemGate. qed.");
  assertIsDefined(properties, "We're inside SystemGate. qed.");

  return (
    <>
      <h3>Transaction Details</h3>
      <div>Network: {chain.toString()}</div>
      <div>From: {sender}</div>
      <div>To: {recipient}</div>

      <div>
        <label>Amount:</label> {amount}{' '}
        {properties.tokenSymbol.unwrapOr('UNIT').toString()}
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

      <Input
        fluid
        label='Password'
        onChange={handler(setPassword)}
        placeholder='Your account password'
        value={password}
      />

      {/* Submit logic is handled by form in Transfer component */}
      <NavButton disabled={txStatus !== 'validated'} type='submit'>
        Submit Transaction
      </NavButton>
    </>
  );
}
