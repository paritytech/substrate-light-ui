// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import IdentityIcon from '@polkadot/ui-identicon';
import { ApiContext } from '@substrate/ui-api';
import { Icon, Margin, Stacked, SubHeader } from '@substrate/ui-components';
import BN from 'bn.js';
import { Subscription } from 'rxjs';
import React from 'react';
import { RouteComponentProps, Redirect } from 'react-router';

import { MatchParams, TransferParams } from './types';

interface Props extends RouteComponentProps<MatchParams, {}, Partial<TransferParams>> { }

export class SentBalance extends React.PureComponent<Props> {
  static contextType = ApiContext;

  private subscription: Subscription | undefined;

  context!: React.ContextType<typeof ApiContext>; // http://bit.ly/typescript-and-react-context

  componentDidMount () {
    // const { api, keyring } = this.context;
    // const { amount, recipientAddress } = state;
    // const senderPair = keyring.getPair(currentAddress);

    // Send the tx
    // TODO Use React context to save it if we come back later.
    // retrieve nonce for the account
    // this.subscription = api.tx.balances
    //   // create transfer
    //   .transfer(recipientAddress, amount)
    //   // send the transaction
    //   .signAndSend(senderPair)
    //   .subscribe(({ status, type }) => {
    //     if (type === 'Finalised') {
    //       this.closeSubscription();
    //       this.onSuccess(`Completed at block hash ${status.asFinalised.toHex()}`);
    //     } else if (type === 'Dropped' || type === 'Usurped') {
    //       this.closeSubscription();
    //       this.onError(`${type} at ${status}`);
    //     } else {
    //       this.onPending(
    //         <Loading active>
    //           {`Status of transfer: ${type}...`}
    //         </Loading>
    //       );
    //     }
    //   });
  }

  componentWillUnmount () {
    this.closeSubscription();
  }

  closeSubscription () {
    if (this.subscription) {
      this.subscription.unsubscribe();
      this.subscription = undefined;
    }
  }

  render () {
    const { location: { state }, match: { params: { currentAddress } } } = this.props;

    if (!(state.amount instanceof BN) || !state.recipientAddress) {
      // This happens when we refresh the page while a tx is sending. In this
      // case, we just redirect to the send tx page.
      return <Redirect to={`/transfer/${currentAddress}`} />;
    }

    const { amount, recipientAddress } = state;

    return (
      <Stacked>
        <Margin bottom>
          <Icon name='check' size='huge' />
        </Margin>

        <Margin top>
          <SubHeader>Summary:</SubHeader>
          <Margin display='inline' left='small' right='small' top='small'>
            <IdentityIcon theme='substrate' size={16} value={currentAddress} />
          </Margin>
          sending {amount.toString()} units to
          <Margin display='inline' left='small' right='small' top='small'>
            <IdentityIcon theme='substrate' size={16} value={recipientAddress} />
          </Margin>
        </Margin>
      </Stacked>
    );
  }
}
