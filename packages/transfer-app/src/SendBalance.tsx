// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ApiContext } from '@substrate/ui-api';
import { AddressSummary, ErrorText, Icon, Input, Margin, NavButton, Stacked, Step } from '@substrate/ui-components';
import BN from 'bn.js';
import React from 'react';
import { RouteComponentProps } from 'react-router-dom';

import { MatchParams, TransferParams } from './types';

interface Props extends RouteComponentProps<MatchParams, {}, Partial<TransferParams>> { }

interface State extends TransferParams {
  amount: BN;
  error?: string;
}

export class SendBalance extends React.PureComponent<Props, State> {
  static contextType = ApiContext;

  context!: React.ContextType<typeof ApiContext>; // http://bit.ly/typescript-and-react-context

  state: State = {
    amount: new BN(0),
    recipientAddress: ''
  };

  isValidAddress = (address: string) => {
    // TODO Do a checksum too
    return address[0] === '5' && address.length === 48;
  }

  onChangeAmount = ({ target: { value } }: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      amount: new BN(value)
    });
  }

  onChangeRecipientAddress = ({ target: { value } }: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      recipientAddress: value
    });
  }

  onError = (value?: string) => {
    this.setState({ error: value });
  }

  onSubmitTransfer = () => {
    const { history, match: { params: { currentAddress: senderAddress } } } = this.props;
    const { amount, recipientAddress } = this.state;

    if (!recipientAddress) {
      this.onError('Please make sure recipient address is set.');
      return;
    }

    if (amount.isZero()) {
      this.onError('Please make sure you are sending more than 0 balance.');
      return;
    }

    history.push(`/transfer/${senderAddress}/sent`, {
      amount,
      recipientAddress
    });
  }

  render() {
    const { keyring } = this.context;
    const { amount, recipientAddress } = this.state;

    const isAddressValid = !!recipientAddress && this.isValidAddress(recipientAddress);
    const recipientName = isAddressValid ? keyring.getAccount(recipientAddress!).getMeta().name : '';

    return (
      <Stacked>
        <Step.Group vertical>
          <Step completed={isAddressValid}>
            <Step.Title> Recipient </Step.Title>
            <Icon name='address book' />
            <Step.Content>
              <Margin top />
              <Stacked>
                <AddressSummary address={recipientAddress} name={recipientName} size='small' />
                <Input onChange={this.onChangeRecipientAddress} type='text' value={recipientAddress} />
              </Stacked>
            </Step.Content>
          </Step>

          <Step completed={!amount.isZero()}>
            <Step.Title> Amount </Step.Title>
            <Icon name='law' />
            <Step.Content>
              <Stacked>
                <Input onChange={this.onChangeAmount} type='number' value={amount} />
              </Stacked>
            </Step.Content>
          </Step>

          <Step>
            <Icon name='send' />
            <Step.Content>
              <NavButton onClick={this.onSubmitTransfer}>Submit Transfer</NavButton>
            </Step.Content>
          </Step>
        </Step.Group>
      </Stacked>
    );
  }

  renderError() {
    const { error } = this.state;

    return error && (
      <ErrorText>
        {error}
      </ErrorText>
    );
  }
}
