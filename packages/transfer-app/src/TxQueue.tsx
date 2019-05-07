// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { TxQueueContext } from '@substrate/ui-common';
import { Icon, NavButton, Stacked, StackedHorizontal, SubHeader, TxDetails, TxSummary } from '@substrate/ui-components';
import React from 'react';
import { RouteComponentProps } from 'react-router-dom';

import { CenterDiv, LeftDiv, RightDiv } from './Transfer.styles';
import { MatchParams } from './types';
import { AllExtrinsicData } from './SendBalance/types';

interface Props extends RouteComponentProps<MatchParams, {}, Partial<AllExtrinsicData> | undefined> { }

export class TxQueue extends React.PureComponent<Props> {
  static contextType = TxQueueContext;

  context!: React.ContextType<typeof TxQueueContext>; // http://bit.ly/typescript-and-react-context

  handleNewTransfer = () => {
    // Transaction was seen by the user, we can remove it
    // Parent component will redirect to SendBalance
    this.context.clear();
  }

  render () {
    const { txQueue } = this.context;

    // The parent component will redirect to SendBalance if empty txQueue
    if (!txQueue.length) return;

    return (
      <StackedHorizontal alignItems='flex-start'>

        <LeftDiv>
          {this.renderTxStatus()}
        </LeftDiv>

        <CenterDiv>
          <SubHeader>Summary:</SubHeader>
          {this.renderSummary()}
        </CenterDiv>

        <RightDiv>
          {this.renderDetails()}
          {txQueue[0].status.isFinalized ? (
            <NavButton onClick={this.handleNewTransfer}>New Transfer</NavButton>
          ) : <p>Please wait until the transaction is validated before making a new transfer..</p>}
        </RightDiv>
      </StackedHorizontal>
    );
  }

  renderDetails () {
    const { match: { params: { currentAccount } } } = this.props;

    const { details: { allFees, allTotal, amount, recipientAddress } } = this.context.txQueue[0];

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

  renderSummary () {
    const { match: { params: { currentAccount } } } = this.props;

    const { details: { amount, recipientAddress } } = this.context.txQueue[0];

    return (
      <TxSummary
        amount={amount}
        recipientAddress={recipientAddress}
        senderAddress={currentAccount}
      />
    );
  }

  renderTxStatus () {
    const { isFinalized, isDropped, isUsurped } = this.context.txQueue[0].status;

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
}
