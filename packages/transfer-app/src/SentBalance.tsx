// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { SubmittableResult } from '@polkadot/api/SubmittableExtrinsic';
import IdentityIcon from '@polkadot/ui-identicon';
import { Balance } from '@polkadot/types';
import { logger } from '@polkadot/util';
import { ApiContext } from '@substrate/ui-api';
import { Icon, Margin, NavButton, Segment, Stacked, StackedHorizontal, SubHeader } from '@substrate/ui-components';
import { Subscription } from 'rxjs';
import React from 'react';
import { RouteComponentProps, Redirect } from 'react-router';

import { CenterDiv, LeftDiv, RightDiv } from './Transfer.styles';
import { MatchParams } from './types';

interface SentState {
  amount?: Balance;
  recipientAddress?: string;
}

interface Props extends RouteComponentProps<MatchParams, {}, SentState> { }

interface State {
  showDetails: boolean;
  txResult?: SubmittableResult;
}

const l = logger('transfer-app');

export class SentBalance extends React.PureComponent<Props, State> {
  static contextType = ApiContext;

  private subscription: Subscription | undefined;

  context!: React.ContextType<typeof ApiContext>; // http://bit.ly/typescript-and-react-context

  state: State = {
    showDetails: false
  };

  componentDidMount () {
    // FIXME Instead of sending here, we should implement a simple tx queue
    // in React Context, so that if the user navigates away and back to this
    // page, his transaction status is still here.
    const { api, keyring } = this.context;
    const { location, match: { params: { currentAccount } } } = this.props;

    if (!location.state || !(location.state.amount instanceof Balance) || !location.state.recipientAddress) {
      // This happens when we refresh the page while a tx is sending. In this
      // case, we just redirect to the send tx page.
      return;
    }

    const { amount, recipientAddress } = location.state;
    const senderPair = keyring.getPair(currentAccount);

    l.log('Sending tx from', currentAccount, 'to', recipientAddress, 'of amount', amount);

    // Send the tx
    // TODO Use React context to save it if we come back later.
    // retrieve nonce for the account
    this.subscription = api.tx.balances
      // create transfer
      .transfer(recipientAddress, amount)
      // send the transaction
      .signAndSend(senderPair)
      .subscribe((txResult: SubmittableResult) => {
        l.log('Tx status update:', txResult);
        this.setState(state => ({ ...state, txResult }));
        const { status: { isFinalized, isDropped, isUsurped } } = txResult;
        if (isFinalized || isDropped || isUsurped) {
          this.closeSubscription();
        }
      });
  }

  closeSubscription () {
    if (this.subscription) {
      this.subscription.unsubscribe();
      this.subscription = undefined;
    }
  }

  handleNewTransfer = () => {
    const { history, match: { params: { currentAccount } } } = this.props;

    // FIXME Remove the tx from the tx queue once we have it

    history.push(`/transfer/${currentAccount}`);
  }

  toggleDetails = () => this.setState({ showDetails: !this.state.showDetails });

  render () {
    const { location, match: { params: { currentAccount } } } = this.props;

    if (!location.state || !(location.state.amount instanceof Balance) || !location.state.recipientAddress) {
      l.warn(`Refreshed on ${location.pathname} with no location state, redirecting to send balance.`);
      // This happens when we refresh the page while a tx is sending. In this
      // case, we just redirect to the send tx page.
      return <Redirect to={`/transfer/${currentAccount}`} />;
    }

    const { amount, recipientAddress } = location.state;
    const { showDetails, txResult } = this.state;

    return (
      <StackedHorizontal alignItems='flex-start'>

        <LeftDiv>
          {this.renderTxStatus()}
        </LeftDiv>

        <CenterDiv>
          <SubHeader>Summary:</SubHeader>
          <Margin as='span' left='small' right='small' top='small'>
            <IdentityIcon theme='substrate' size={16} value={currentAccount} />
          </Margin>
          sending {amount.toString()} units to
          <Margin as='span' left='small' right='small' top='small'>
            <IdentityIcon theme='substrate' size={16} value={recipientAddress} />
          </Margin>
        </CenterDiv>

        <RightDiv>
          <SubHeader onClick={this.toggleDetails}>
            {showDetails ? 'Hide' : 'Click here'}
          </SubHeader>
          {showDetails ? this.renderDetails() : <p>to view full details</p>}
          {txResult && txResult.status.isFinalized && (
            <NavButton onClick={this.handleNewTransfer}>New Transfer</NavButton>
          )}
        </RightDiv>
      </StackedHorizontal>
    );
  }

  renderDetails () {
    const { location: { state }, match: { params: { currentAccount } } } = this.props;
    const { amount, recipientAddress } = state;

    return (
      <Segment placeholder>
        <p>From: {currentAccount}</p>
        <p>To: {recipientAddress}</p>
        <p>Amount: {amount!.toString()} units</p>
        <p>Fees: [TODO]</p>
        <p>Total amount (amount + fees): [TODO]</p>
      </Segment>
    );
  }

  renderTxStatus () {
    const { txResult } = this.state;

    switch (txResult && txResult.status.type) {
      case 'Finalized':
        return <Stacked>
          <SubHeader color='lightBlue1' >Transaction completed!</SubHeader>
          <Icon name='check' size='big' />
        </Stacked>;
      case 'Dropped':
      case 'Usurped':
        return <Stacked>
          <SubHeader color='lightBlue1'>Transaction error!</SubHeader>
          <Icon error name='cross' size='big' />
        </Stacked>;
      default:
        return <Stacked>
          <SubHeader color='lightBlue1'>Sending...</SubHeader>
          <Icon loading name='spinner' size='big' />
        </Stacked>;
    }
  }
}
