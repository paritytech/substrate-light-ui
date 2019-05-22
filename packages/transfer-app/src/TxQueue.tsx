// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { PendingExtrinsic, TxQueueContext } from '@substrate/ui-common';
import { Icon, NavButton, Stacked, StackedHorizontal, SubHeader, TxDetails, TxSummary } from '@substrate/ui-components';
import React, { useContext } from 'react';
import { RouteComponentProps } from 'react-router-dom';

import { CenterDiv, LeftDiv, RightDiv } from './Transfer.styles';
import { MatchParams } from './types';
import { AllExtrinsicData } from './SendBalance/types';

interface Props extends RouteComponentProps<MatchParams, {}, Partial<AllExtrinsicData> | undefined> { }

export function TxQueue (props: Props) {
  const { match: { params: { currentAccount } } } = props;
  const { clear, txQueue } = useContext(TxQueueContext);

  // The parent component will redirect to SendBalance if empty txQueue
  if (!txQueue.length) return;

  return (
    <StackedHorizontal alignItems='flex-start'>

      <LeftDiv>
        {renderTxStatus(txQueue)}
      </LeftDiv>

      <CenterDiv>
        <SubHeader>Summary:</SubHeader>
        {renderSummary(currentAccount, txQueue)}
      </CenterDiv>

      <RightDiv>
        {renderDetails(currentAccount, txQueue)}
        {txQueue[0].status.isFinalized ? (
          <NavButton onClick={clear}>New Transfer</NavButton>
        ) : <p>Please wait until the transaction is validated before making a new transfer..</p>}
      </RightDiv>
    </StackedHorizontal>
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
  const { details: { amount, recipientAddress } } = txQueue[0];

  return (
    <TxSummary
      amount={amount}
      recipientAddress={recipientAddress}
      senderAddress={currentAccount}
    />
  );
}

function renderTxStatus (txQueue: PendingExtrinsic[]) {
  const { isFinalized, isDropped, isUsurped } = txQueue[0].status;

  if (isFinalized) {
    return <Stacked>
      <SubHeader color='lightBlue1' >Transaction completed!</SubHeader>
      <Icon name='check' size='big' />
    </Stacked>;
  } else if (isDropped || isUsurped) {
    return <Stacked>
      <SubHeader color='lightBlue1'>Transaction error!</SubHeader>
      <Icon error name='cross' size='big' />
    </Stacked>;
  } else {
    return <Stacked>
      <SubHeader color='lightBlue1'>Sending...</SubHeader>
      <Icon loading name='spinner' size='big' />
    </Stacked>;
  }
}
