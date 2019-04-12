// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Balance as BalanceType } from '@polkadot/types';
import { IExtrinsic } from '@polkadot/types/types';
import { AppContext } from '@substrate/ui-common';
import { Balance, ErrorText, Form, Input, NavButton, StackedHorizontal, SubHeader } from '@substrate/ui-components';
import React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { Observable, Subscription } from 'rxjs';

import { Checks } from './Checks';
import { CenterDiv, InputAddress, LeftDiv, RightDiv } from './Transfer.styles';
import { MatchParams } from './types';

interface SendMatchParams extends MatchParams {
  recipientAddress?: string;
}

interface Props extends RouteComponentProps<SendMatchParams> { }

interface State {
  amountAsString: string;
  balance?: BalanceType; // The balance of the sender
  extrinsic?: IExtrinsic;
  error?: string;
}

// All fields necessary to perform form validation
interface FormFields {
  amount?: BalanceType;
  balance?: BalanceType;
  currentAccount?: string;
  recipientAddress?: string;
}

export class SendBalance extends React.PureComponent<Props, State> {
  static contextType = AppContext;

  context!: React.ContextType<typeof AppContext>; // http://bit.ly/typescript-and-react-context

  state: State = {
    amountAsString: ''
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

  calculateFees = () => {
    const { api } = this.context;
    const { match: { params: { currentAccount, recipientAddress } } } = this.props;
    const { amountAsString, balance } = this.state;

    const amount = new BalanceType(amountAsString);

    // Check if we have validation errors
    const hasError = Object.keys(this.validate({ amount, balance, currentAccount, recipientAddress })).length > 0;

    if (hasError) {
      return;
    }

    const extrinsic = api.tx.balances.transfer(recipientAddress, amount);
    this.setState({ extrinsic });
  }

  closeSubscription () {
    if (this.subscription) {
      this.subscription.unsubscribe();
      this.subscription = undefined;
    }
  }

  handleChangeAmount = ({ target: { value } }: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      amountAsString: value,
      error: undefined,
      extrinsic: undefined
    }, this.calculateFees);
  }

  handleChangeCurrentAccount = (account: string) => {
    const { history, match: { params: { recipientAddress } } } = this.props;

    this.setState({
      error: undefined,
      extrinsic: undefined
    }, this.calculateFees);

    history.push(`/transfer/${account}/${recipientAddress}`);
  }

  handleChangeRecipientAddress = (recipientAddress: string) => {
    const { history, match: { params: { currentAccount } } } = this.props;

    this.setState({
      error: undefined,
      extrinsic: undefined
    }, this.calculateFees);

    history.push(`/transfer/${currentAccount}/${recipientAddress}`);
  }

  handleError (error: string) {
    this.setState({ error });
  }

  handleSubmit = () => {
    const { history, match: { params: { currentAccount, recipientAddress } } } = this.props;
    const { amountAsString, balance } = this.state;

    const amount = new BalanceType(amountAsString);

    // Check if we have validation errors
    const error = Object.values(this.validate({ amount, balance, currentAccount, recipientAddress }))[0];
    if (error) {
      this.handleError(error);
      return;
    }

    // If everything is correct, then go to sent
    history.push(`/transfer/${currentAccount}/sent`, {
      amount,
      recipientAddress
    });
  }

  subscribeBalance () {
    const { api } = this.context;
    const { match: { params: { currentAccount } } } = this.props;

    // Subscribe to sender's balance
    // FIXME using any because freeBalance gives a Codec here, not a Balance
    // Wait for @polkadot/api to have TS support for all query.*
    this.subscription = (api.query.balances.freeBalance(currentAccount) as Observable<BalanceType>)
      .subscribe((balance) => this.setState({ balance }));
  }

  validate ({ amount, balance, currentAccount, recipientAddress }: FormFields): Partial<Record<keyof FormFields, string>> {
    // Do validation on account/address
    if (!currentAccount) {
      return { currentAccount: 'Please enter a sender account.' };
    }
    if (!currentAccount) {
      return { currentAccount: 'Please enter a recipient address.' };
    }
    if (currentAccount === recipientAddress) {
      return { currentAccount: 'You cannot send balance to yourself.' };
    }

    // Do validation on amount
    if (!balance) {
      // FIXME Improve UX here
      return { balance: "Please try again in a few seconds as we're fetching your balance." };
    }

    if (!amount) {
      return { amount: 'Please enter an amount' };
    }

    if (amount.isNeg()) {
      return { amount: 'Please enter a positive amount to transfer.' };
    }

    if (amount.isZero()) {
      return { amount: 'Please make sure you are sending more than 0 balance.' };
    }

    if (amount.gt(balance)) {
      // FIXME Substract fees
      return { amount: 'You do not have enough balance to make this transfer.' };

    }

    return {};
  }

  render () {
    const { match: { params: { currentAccount, recipientAddress } } } = this.props;
    const { amountAsString, error, extrinsic } = this.state;

    return (
      <Form onSubmit={this.handleSubmit}>
        <StackedHorizontal alignItems='flex-start'>
          <LeftDiv>
            <SubHeader textAlign='left'>Sender Account:</SubHeader>
            <InputAddress
              isDisabled
              onChange={this.handleChangeCurrentAccount}
              type='account'
              value={currentAccount}
              withLabel={false}
            />
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
              value={amountAsString}
            />
            <Checks extrinsic={extrinsic} />
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
            <Balance address={recipientAddress} />
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

  renderError () {
    const { error } = this.state;

    return error && (
      <ErrorText>
        {error}
      </ErrorText>
    );
  }
}
