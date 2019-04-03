// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Balance } from '@polkadot/types';
import { ApiContext, Subscribe } from '@substrate/ui-api';
import { BalanceDisplay, ErrorText, Form, Input, NavButton, StackedHorizontal, SubHeader } from '@substrate/ui-components';
import React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

import { MatchParams } from './types';
import { CenterDiv, InputAddress, LeftDiv, RightDiv } from './Transfer.styles';

interface SendMatchParams extends MatchParams {
  recipientAddress?: string;
}

interface Props extends RouteComponentProps<SendMatchParams> { }

interface State {
  amount: string;
  balance?: Balance; // The balance of the sender
  error?: string;
}

export class SendBalance extends React.PureComponent<Props, State> {
  static contextType = ApiContext;

  context!: React.ContextType<typeof ApiContext>; // http://bit.ly/typescript-and-react-context

  state: State = {
    amount: ''
  };

  subscription?: Subscription;

  componentDidMount () {
    this.subscribeBalance();
  }

  componentDidUpdate (prevProps: Props) {
    if (prevProps.match.params.currentAccount !== this.props.match.params.currentAccount) {
      this.closeSubscription();
      this.subscribeBalance();
    }
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

  handleChangeAmount = ({ target: { value } }: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      amount: value,
      error: undefined
    });
  }

  handleChangeCurrentAccount = (account: string) => {
    const { history, match: { params: { recipientAddress } } } = this.props;

    this.setState({
      error: undefined
    });

    history.push(`/transfer/${account}/${recipientAddress}`);
  }

  handleChangeRecipientAddress = (recipientAddress: string) => {
    const { history, match: { params: { currentAccount } } } = this.props;

    this.setState({
      error: undefined
    });

    history.push(`/transfer/${currentAccount}/${recipientAddress}`);
  }

  handleError = (error: string) => {
    this.setState({ error });
  }

  handleSubmit = () => {
    const { history, match: { params: { currentAccount, recipientAddress } } } = this.props;
    const { amount, balance } = this.state;

    // Do validation on amount
    const amountBn = new Balance(amount);

    if (!balance) {
      // FIXME Improve UX here
      this.handleError("Please try again in a few seconds as we're fetching your balance.");
      return;
    }

    if (amountBn.isNeg()) {
      this.handleError('Please enter a positive amount to transfer.');
      return;
    }

    if (amountBn.isZero()) {
      this.handleError('Please make sure you are sending more than 0 balance.');
      return;
    }

    if (amountBn.gt(balance)) {
      this.handleError('You do not have enough balance to make this transfer.');
      return;
    }

    // If everything is correct, then go to sent
    history.push(`/transfer/${currentAccount}/sent`, {
      amount: amountBn,
      recipientAddress
    });
  }

  subscribeBalance = () => {
    const { api } = this.context;
    const { match: { params: { currentAccount } } } = this.props;

    // Subscribe to sender's balance
    // FIXME using any because freeBalance gives a Codec here, not a Balance
    // Wait for @polkadot/api to have TS support for all query.*
    this.subscription = (api.query.balances.freeBalance(currentAccount) as Observable<Balance>)
      .subscribe((balance) => this.setState({ balance }));
  }

  render () {
    const { api } = this.context;
    const { match: { params: { currentAccount, recipientAddress } } } = this.props;
    const { amount, balance, error } = this.state;

    // const isAddressValid = !!recipientAddress && this.isValidAddress(recipientAddress);
    // const recipientName = isAddressValid ? keyring.getAccount(recipientAddress).getMeta().name : '';

    return (
      <Form onSubmit={this.handleSubmit}>
        <StackedHorizontal alignItems='flex-start'>
          <LeftDiv>
            <SubHeader textAlign='left'>Sender Account:</SubHeader>
            <InputAddress
              onChange={this.handleChangeCurrentAccount}
              type='account'
              value={currentAccount}
              withLabel={false}
            />
            {this.renderBalance(balance)}
          </LeftDiv>

          <CenterDiv>
            <SubHeader textAlign='left'>Amount:</SubHeader>
            <Input
              fluid
              label='UNIT'
              labelPosition='right'
              min={0}
              onChange={this.handleChangeAmount}
              placeholder='e.g. 1.00'
              type='number'
              value={amount}
            />
          </CenterDiv>

          <RightDiv>
            <SubHeader textAlign='left'>Recipient Address:</SubHeader>
            <InputAddress
              label={null}
              onChange={this.handleChangeRecipientAddress}
              type='all'
              value={recipientAddress}
              withLabel={false}
            />
            {recipientAddress && <Subscribe>
              {
                // FIXME using any because freeBalance gives a Codec here, not a Balance
                // Wait for @polkadot/api to have TS support for all query.*
                api.query.balances.freeBalance(recipientAddress).pipe(map(this.renderBalance as any))
              }
            </Subscribe>}
          </RightDiv>
        </StackedHorizontal>
        <StackedHorizontal>
          <LeftDiv />
          <CenterDiv>{this.renderError()}</CenterDiv>
          <RightDiv>
            <NavButton disabled={!!error}>Submit</NavButton>
          </RightDiv>
        </StackedHorizontal>
      </Form>
    );
  }

  renderBalance (balance?: Balance) {
    return balance && <BalanceDisplay balance={balance} />;
  }

  renderError () {
    const { error } = this.state;

    return error && (
      <ErrorText>
        {error}
      </ErrorText>
    );
  }
}
