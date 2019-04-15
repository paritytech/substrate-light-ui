// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { SubmittableResult } from '@polkadot/api/SubmittableExtrinsic';
import IdentityIcon from '@polkadot/ui-identicon';
import { Balance } from '@polkadot/types';
import { logger } from '@polkadot/util';
import { AppContext } from '@substrate/ui-common';
import { Icon, Margin, Message, NavButton, NavLink, Segment, Stacked, StackedHorizontal, SubHeader } from '@substrate/ui-components';
import { Subscription } from 'rxjs';
import React from 'react';
import { RouteComponentProps, Redirect } from 'react-router-dom';

import { CenterDiv, LeftDiv, RightDiv } from './Transfer.styles';
import { MatchParams } from './types';
import { AllExtrinsicData } from './SendBalance/types';

interface Props extends RouteComponentProps<MatchParams, {}, Partial<AllExtrinsicData> | undefined> { }

interface State {
  showDetails: boolean;
  txResult?: SubmittableResult;
}

const l = logger('transfer-app');

export class SentBalance extends React.PureComponent<Props, State> {
  static contextType = AppContext;

  private subscription: Subscription | undefined;

  context!: React.ContextType<typeof AppContext>; // http://bit.ly/typescript-and-react-context

  state: State = {
    showDetails: false
  };

  componentDidMount () {
    // FIXME Instead of sending here, we should implement a simple tx queue
    // in React Context, so that if the user navigates away and back to this
    // page, his transaction status is still here.
    const { alertStore, keyring } = this.context;
    const { location, match: { params: { currentAccount } } } = this.props;

    if (!this.checkLocationState(location.state)) {
      // This happens when we refresh the page while a tx is sending. In this
      // case, we just redirect to the send tx page.
      return;
    }

    const { amount, extrinsic, recipientAddress } = location.state;
    const senderPair = keyring.getPair(currentAccount);

    l.log('Sending tx from', currentAccount, 'to', recipientAddress, 'of amount', amount);

    // Send the tx
    // TODO Use React context to save it if we come back later.
    // retrieve nonce for the account
    this.subscription = extrinsic
      // send the extrinsic
      .signAndSend(senderPair)
      .subscribe(
        (txResult: SubmittableResult) => {
          l.log(`Tx status update: ${txResult.status}`);
          this.setState(state => ({ ...state, txResult }));
          const { status: { isFinalized, isDropped, isUsurped } } = txResult;

          if (isFinalized) {
            alertStore.enqueue({
              content: this.renderSuccess(),
              type: 'success'
            });
          }

          if (isFinalized || isDropped || isUsurped) {
            this.closeSubscription();
          }
        },
        (error: Error) => {
          alertStore.enqueue({
            content: <Message.Content>
              <Message.Header>Error!</Message.Header>
              <Message.Content>{error.message}</Message.Content>
            </Message.Content>,
            type: 'error'
          });
        }
      );
  }

  /**
   * We use `history.push(pathname, state)`, we make sure here that `state` is
   * well defined in that case.
   */
  checkLocationState (locationState: Partial<AllExtrinsicData> | undefined): locationState is AllExtrinsicData {
    if (
      !locationState ||
      !(locationState.amount instanceof Balance) ||
      !locationState.recipientAddress ||
      !locationState.extrinsic
    ) {
      return false;
    }

    return true;
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

    if (!this.checkLocationState(location.state)) {
      l.warn(`Refreshed on ${location.pathname} with no location state, redirecting to send balance.`);
      // This happens when we refresh the page while a tx is sending. In this
      // case, we just redirect to the send tx page.
      return <Redirect to={`/transfer/${currentAccount}`} />;
    }

    const { showDetails, txResult } = this.state;

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
    const { location, match: { params: { currentAccount } } } = this.props;

    if (!this.checkLocationState(location.state)) {
      return null;
    }

    const { allFees, allTotal, amount, recipientAddress } = location.state;

    return (
      <Segment placeholder>
        <p>From: {currentAccount}</p>
        <p>To: {recipientAddress}</p>
        <p>Amount: {amount!.toString()} units</p>
        <p>Fees: {allFees.toString()} units</p>
        <p>Total amount (amount + fees): {allTotal.toString()} units</p>
      </Segment>
    );
  }

  renderSummary () {
    const { location, match: { params: { currentAccount } } } = this.props;

    if (!this.checkLocationState(location.state)) {
      return null;
    }

    const { amount, recipientAddress } = location.state;

    return (
      <StackedHorizontal>
        <Margin as='span' left='small' right='small' top='small'>
          <IdentityIcon theme='substrate' size={16} value={currentAccount} />
        </Margin>
        sent {amount!.toString()} units to
        <Margin as='span' left='small' right='small' top='small'>
          <IdentityIcon theme='substrate' size={16} value={recipientAddress} />
        </Margin>
      </StackedHorizontal>
    );
  }

  renderSuccess () {
    const { match: { params: { currentAccount } } } = this.props;

    return (
      <Message.Content>
        <StackedHorizontal justifyContent='space-around'>
          <span>Transaction Completed!</span>
          {this.renderSummary()}
          <NavLink inverted to={`/transfer/${currentAccount}/sent`}>View transfer details</NavLink>
        </StackedHorizontal>
      </Message.Content>
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
