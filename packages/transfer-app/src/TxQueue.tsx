// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { PendingExtrinsic, TxQueueContext } from '@substrate/ui-common';
import { FlexItem, Icon, NavButton, Stacked, SubHeader, TxDetails, TxSummary } from '@substrate/ui-components';
import React, { useContext } from 'react';

import { AllExtrinsicData } from './SendBalance/types';

interface Props extends Partial<AllExtrinsicData> {
  currentAccount: string;
}

export function TxQueue (props: Props) {
  const { currentAccount } = props;
  const { clear, txQueue } = useContext(TxQueueContext);

  // The parent component will redirect to SendBalance if empty txQueue
  if (!txQueue.length) return null;

  return (
    <Stacked>
      {renderTxStatus(txQueue)}

      <FlexItem>
        <SubHeader>Summary:</SubHeader>
        {renderSummary(currentAccount, txQueue)}
      </FlexItem>

      <FlexItem>
        {renderDetails(currentAccount, txQueue)}
        {txQueue[0].status.isFinalized ? (
          <NavButton onClick={clear}>New Transfer</NavButton>
        ) : <p>Please wait until the transaction is validated before making a new transfer..</p>}
      </FlexItem>
    </Stacked>
  );
}

function renderDetails (currentAccount: string, txQueue: PendingExtrinsic[]) {
  const { details: { allFees, allTotal, amount, recipientAddress } } = txQueue[0];

  return (
    <TxDetails
      allFees={allFees}
      allTotal={allTotal}
      amount={amount}
      recipientAddress={recipientAddress}
      senderAddress={currentAccount}
    />
  );
}

function renderSummary (currentAccount: string, txQueue: PendingExtrinsic[]) {
  const { details: { amount, recipientAddress }, extrinsic: { meta: { name } } } = txQueue[0];

  return (
    <TxSummary
      amount={amount}
      methodCall={name.toString()}
      recipientAddress={recipientAddress}
      senderAddress={currentAccount}
    />
  );
}

function renderTxStatus (txQueue: PendingExtrinsic[]) {
  const { isFinalized, isDropped, isUsurped } = txQueue[0].status;

  if (isFinalized) {
    return renderTxStatusHelper('Transaction completed!', 'check');
  } else if (isDropped || isUsurped) {
    return renderTxStatusHelper('Transaction error!', 'cross');
  } else {
    return renderTxStatusHelper('Sending...', 'spinner');
  }
}

function renderTxStatusHelper (label: string, icon: string) {
  return <Stacked>
    <SubHeader color='lightBlue1' >{label}</SubHeader>
    <Icon name={icon} size='big' />
  </Stacked>;
}
