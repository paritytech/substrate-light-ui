// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import IdentityIcon from '@polkadot/ui-identicon';
import { TxQueueContext } from '@substrate/ui-common';
import { Icon, Margin, NavButton, Segment, Stacked, StackedHorizontal, SubHeader } from '@substrate/ui-components';
import React from 'react';
import { RouteComponentProps } from 'react-router-dom';

import { CenterDiv, LeftDiv, RightDiv } from './Transfer.styles';
import { MatchParams } from './types';
import { AllExtrinsicData } from './SendBalance/types';

interface Props extends RouteComponentProps<MatchParams, {}, Partial<AllExtrinsicData> | undefined> { }

interface State {
  showDetails: boolean;
}

export class TxQueue extends React.PureComponent<Props, State> {
  static contextType = TxQueueContext;

  context!: React.ContextType<typeof TxQueueContext>; // http://bit.ly/typescript-and-react-context

  state: State = {
    showDetails: false
  };

  handleNewTransfer = () => {
    // Transaction was seen by the user, we can remove it
    // Parent component will redirect to SendBalance
    this.context.clear();
  }

  toggleDetails = () => this.setState({ showDetails: !this.state.showDetails });

  render () {
    const { txQueue } = this.context;

    // The parent component will redirect to SendBalance if empty txQueue
    if (!txQueue.length) return;

    const { showDetails } = this.state;

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
          <SubHeader onClick={this.toggleDetails}>
            {showDetails ? 'Hide' : 'Click here to view details'}
          </SubHeader>
          {showDetails && this.renderDetails()}
          {txQueue[0].status.isFinalized ? (
            <NavButton onClick={this.handleNewTransfer}>New Transfer</NavButton>
          ) : <p>Please wait until the transaction is validated before making a new transfer..</p>}
        </RightDiv>
      </StackedHorizontal>
    );
  }

  renderDetails () {
    const { match: { params: { currentAccount } } } = this.props;

    const { allFees, allTotal, amount, recipientAddress } = this.context.txQueue[0];

    return (
      <Segment placeholder>
        <p>From: {currentAccount}</p>
        <p>To: {recipientAddress}</p>
        <p>Amount: {amount.toString()} units</p>
        <p>Fees: {allFees.toString()} units</p>
        <p>Total amount (amount + fees): {allTotal.toString()} units</p>
      </Segment>
    );
  }

  renderSummary () {
    const { match: { params: { currentAccount } } } = this.props;

    const { amount, recipientAddress } = this.context.txQueue[0];

    return (
      <StackedHorizontal>
        <Margin as='span' left='small' right='small' top='small'>
          <IdentityIcon theme='substrate' size={16} value={currentAccount} />
        </Margin>
        sent {amount.toString()} units to
        <Margin as='span' left='small' right='small' top='small'>
          <IdentityIcon theme='substrate' size={16} value={recipientAddress} />
        </Margin>
      </StackedHorizontal>
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
