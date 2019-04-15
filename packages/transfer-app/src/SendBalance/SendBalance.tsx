// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Balance as BalanceType } from '@polkadot/types';
import { IExtrinsic } from '@polkadot/types/types';
import { AppContext } from '@substrate/ui-common';
import { Balance, Form, Input, NavButton, StackedHorizontal, SubHeader } from '@substrate/ui-components';
import React from 'react';
import { RouteComponentProps } from 'react-router-dom';

import { CenterDiv, InputAddress, LeftDiv, RightDiv } from '../Transfer.styles';
import { MatchParams } from '../types';
import { Validation } from './Validation';

interface SendMatchParams extends MatchParams {
  recipientAddress?: string;
}

interface Props extends RouteComponentProps<SendMatchParams> { }

interface State {
  amountAsString: string;
  balance?: BalanceType; // The balance of the sender
  extrinsic?: IExtrinsic;
  isValid: boolean; // Is form valid?
}

export class SendBalance extends React.PureComponent<Props, State> {
  static contextType = AppContext;

  context!: React.ContextType<typeof AppContext>; // http://bit.ly/typescript-and-react-context

  state: State = {
    amountAsString: '',
    isValid: false
  };

  getExtrinsic (recipientAddress: string, amount: BalanceType) {
    const { api } = this.context;

    return api.tx.balances.transfer(recipientAddress, amount);
  }

  handleChangeAmount = ({ target: { value } }: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      amountAsString: value,
      extrinsic: undefined
    });
  }

  handleChangeCurrentAccount = (account: string) => {
    const { history, match: { params: { recipientAddress } } } = this.props;

    history.push(`/transfer/${account}/${recipientAddress}`);
  }

  handleChangeRecipientAddress = (recipientAddress: string) => {
    const { history, match: { params: { currentAccount } } } = this.props;

    this.setState({
      extrinsic: undefined
    });

    history.push(`/transfer/${currentAccount}/${recipientAddress}`);
  }

  handleSubmit = () => {
    const { history, match: { params: { currentAccount, recipientAddress } } } = this.props;
    const { amountAsString, isValid } = this.state;

    if (!isValid) {
      // Do nothing if form is not valid
      return;
    }

    const amount = new BalanceType(amountAsString);

    // If everything is correct, then go to sent
    history.push(`/transfer/${currentAccount}/sent`, {
      amount,
      recipientAddress
    });
  }

  render () {
    const { match: { params: { currentAccount, recipientAddress } } } = this.props;
    const { amountAsString, isValid } = this.state;

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
            <Balance address={currentAccount} />
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
          <CenterDiv>
            <Validation
              amountAsString={amountAsString}
              currentAccount={currentAccount}
              onValidExtrinsic={console.log}
              recipientAddress={recipientAddress}
            />
          </CenterDiv>
          <RightDiv>
            <NavButton disabled={isValid}>Submit</NavButton>
          </RightDiv>
        </StackedHorizontal>
      </Form>
    );
  }
}
