// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ApiContext } from '@substrate/ui-api';
import { AddressSummary, ErrorText, Grid, Header, Icon, Input, Loading, MarginTop, NavButton, Stacked, Step, SuccessText } from '@substrate/ui-components';
import BN from 'bn.js';
import React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { Subscription } from 'rxjs';

import { Saved } from './Saved';

interface MatchParams {
  currentAddress: string;
}

interface Props extends RouteComponentProps<MatchParams> {
  basePath: string;
}

type State = {
  amount: BN,
  error: string | null,
  isAddressValid: boolean,
  subscription?: Subscription,
  open: boolean,
  pending: string | React.ReactNode | null,
  recipientAddress?: string,
  recipientName?: string,
  step: number,
  success: string | null
};

export class SendBalance extends React.PureComponent<Props, State> {
  static contextType = ApiContext;

  private subscription: Subscription | undefined;

  context!: React.ContextType<typeof ApiContext>; // http://bit.ly/typescript-and-react-context

  state: State = {
    amount: new BN(0),
    error: null,
    isAddressValid: false,
    open: false,
    pending: null,
    step: 1,
    success: null
  };

  componentWillUnmount () {
    this.closeSubscription();
  }

  closeSubscription () {
    if (this.subscription) {
      this.subscription.unsubscribe();
      this.subscription = undefined;
    }
  }

  isValidAddress = (address: string) => {
    return address[0] === '5' && address.length === 48;
  }

  onChangeAmount = ({ target: { value } }: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      amount: new BN(value)
    });
  }

  onSelectAddress = (address: string, name: string) => {
    this.setState({
      isAddressValid: this.isValidAddress(address),
      recipientName: name,
      recipientAddress: address
    });
  }

  onChangeRecipientAddress = ({ target: { value } }: React.ChangeEvent<HTMLInputElement>) => {
    const { keyring } = this.context;

    const isAddressValid = this.isValidAddress(value);

    this.setState({
      isAddressValid,
      recipientAddress: value,
      recipientName: isAddressValid ? keyring.getAccount(value).getMeta().name : ''
    });
  }

  onClose = () => {
    this.setState({
      open: false
    });
  }

  onError = (value: string | null) => {
    this.setState({ error: value, pending: null, success: null });
  }

  onPending = (value: string | React.ReactNode | null) => {
    this.setState({ error: null, pending: value, success: null });
  }

  onSubmitTransfer = async () => {
    const { api, keyring } = this.context;
    const { amount, recipientAddress } = this.state;
    const { match } = this.props;

    const senderAddress = match.params.currentAddress;

    if (!recipientAddress) {
      this.onError('Please sure recipient address is set.');
      return;
    }

    if (!amount || amount.isZero()) {
      this.onError('Please sure you are sending more than 0 balance.');
      return;
    }

    if (recipientAddress === senderAddress) {
      this.onError('Sender and recipient addresses cannot be the same.');
      return;
    }

    const senderPair = keyring.getPair(senderAddress);

    try {
      // retrieve nonce for the account
      this.subscription = api.tx.balances
        // create transfer
        .transfer(recipientAddress, amount)
        // send the transaction
        .signAndSend(senderPair)
        .subscribe(({ status, type }) => {
          if (type === 'Finalised') {
            this.closeSubscription();
            this.onSuccess(`Completed at block hash ${status.asFinalised.toHex()}`);
          } else if (type === 'Dropped' || type === 'Usurped') {
            this.closeSubscription();
            this.onError(`${type} at ${status}`);
          } else {
            this.onPending(
              <Loading active>
                {`Status of transfer: ${type}...`}
              </Loading>
            );
          }
        });
    } catch (error) {
      this.onError(error);
    }
  }

  onSuccess = (value: string | null) => {
    this.setState({ error: null, pending: null, success: value });
  }

  openSelectAccountsModal = () => {
    this.setState({
      open: true
    });
  }

  render () {
    const { amount, isAddressValid, pending, recipientAddress, recipientName } = this.state;

    return (
      <Grid>
        <Grid.Row centered>
          <Header> Transfer Balance </Header>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column width='10'>
            <Saved onSelectAddress={this.onSelectAddress} {...this.props} />
          </Grid.Column>

          <Grid.Column width='6'>
            <Stacked>
              {this.renderSuccess()}
              {this.renderError()}
              {this.renderPending()}
              <Step.Group vertical>
                <Step completed={isAddressValid}>
                  <Step.Title> Recipient </Step.Title>
                  <Icon name='address book' />
                  <Step.Content>
                    <MarginTop />
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
                    {
                      pending
                        ? this.renderPending()
                        : <NavButton onClick={this.onSubmitTransfer}>Submit Transfer</NavButton>
                    }
                  </Step.Content>
                </Step>
              </Step.Group>
            </Stacked>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }

  renderError () {
    const { error } = this.state;

    return error && (
      <ErrorText>
        {error}
      </ErrorText>
    );
  }

  renderSuccess () {
    const { success } = this.state;

    return success && (
      <SuccessText>
        {success}
      </SuccessText>
    );
  }

  renderPending () {
    return this.state.pending || null;
  }
}
