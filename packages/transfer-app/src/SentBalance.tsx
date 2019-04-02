// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { SubmittableResult } from '@polkadot/api/SubmittableExtrinsic';
import IdentityIcon from '@polkadot/ui-identicon';
import { logger } from '@polkadot/util';
import { ApiContext } from '@substrate/ui-api';
import { Icon, InlineSubHeader, Margin, Stacked, SubHeader } from '@substrate/ui-components';
import BN from 'bn.js';
import { Subscription } from 'rxjs';
import React from 'react';
import { RouteComponentProps, Redirect } from 'react-router';

import { NoMarginHeader } from './SentBalance.styles';
import { MatchParams, TransferParams } from './types';

interface Props extends RouteComponentProps<MatchParams, {}, Partial<TransferParams>> { }

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
    const { api, keyring } = this.context;
    const { location: { state }, match: { params: { currentAddress } } } = this.props;

    if (!state || !(state.amount instanceof BN) || !state.recipientAddress) {
      // This happens when we refresh the page while a tx is sending. In this
      // case, we just redirect to the send tx page.
      return;
    }

    const { amount, recipientAddress } = state;
    const senderPair = keyring.getPair(currentAddress);

    l.log('sending tx from', currentAddress, 'to', recipientAddress, 'of amount', amount);

    // Send the tx
    // TODO Use React context to save it if we come back later.
    // retrieve nonce for the account
    this.subscription = api.tx.balances
      // create transfer
      .transfer(recipientAddress, amount)
      // send the transaction
      .signAndSend(senderPair)
      .subscribe((txResult: SubmittableResult) => {
        l.log('tx status update:', txResult);
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

  toggleDetails = () => this.setState({ showDetails: !this.state.showDetails });

  render () {
    const { location, match: { params: { currentAddress } } } = this.props;

    if (!location.state || !(location.state.amount instanceof BN) || !location.state.recipientAddress) {
      // This happens when we refresh the page while a tx is sending. In this
      // case, we just redirect to the send tx page.
      return <Redirect to={`/transfer/${currentAddress}`} />;
    }

    const { amount, recipientAddress } = location.state;
    const { showDetails } = this.state;

    return (
      <Stacked>

        {this.renderTxStatus()}

        <Margin top>
          <InlineSubHeader>Summary:</InlineSubHeader>
          <Margin as='span' left='small' right='small' top='small'>
            <IdentityIcon theme='substrate' size={16} value={currentAddress} />
          </Margin>
          sending {amount.toString()} units to
          <Margin as='span' left='small' right='small' top='small'>
            <IdentityIcon theme='substrate' size={16} value={recipientAddress} />
          </Margin>
        </Margin>

        <Margin top='huge'>
          <SubHeader onClick={this.toggleDetails}>
            {showDetails ? 'Hide' : 'Click here'}
          </SubHeader>
          {showDetails ? this.renderDetails() : <p>to view full details</p>}
        </Margin>
      </Stacked>
    );
  }

  renderDetails () {
    const { location: { state }, match: { params: { currentAddress } } } = this.props;
    const { amount, recipientAddress } = state;

    return (
      <div>
        <p>From: {currentAddress}</p>
        <p>To: {recipientAddress}</p>
        <p>Amount: {amount!.toString()} units</p>
        <p>Fees: [TODO]</p>
        <p>Total amount (amount + fees): [TODO]</p>
      </div>
    );
  }

  renderTxStatus () {
    const { txResult } = this.state;

    switch (txResult && txResult.status.type) {
      case 'Finalized':
        return <Margin bottom>
          <Icon name='check' size='huge' />
          <NoMarginHeader color='lightBlue1' >Transaction completed!</NoMarginHeader>
        </Margin>;
      case 'Dropped':
      case 'Usurped':
        return <Margin bottom>
          <Icon error name='cross' size='huge' />
          <NoMarginHeader color='lightBlue1'>Transaction error!</NoMarginHeader>
        </Margin>;
      default:
        return <Margin bottom>
          <Icon loading name='spinner' size='huge' />
          <NoMarginHeader color='lightBlue1'>Sending...</NoMarginHeader>
        </Margin>;
    }
  }
}
