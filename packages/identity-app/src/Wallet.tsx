// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ErrorText, Input, Margin, NavButton, Stacked, SubHeader, SuccessText, WalletCard, WithSpace } from '@substrate/ui-components';
import React from 'react';

type Props = {};

type State = {
  error: string | null,
  lookupAddress: string,
  name: string,
  recoveryPhrase: string,
  success: string | null
};

export class Wallet extends React.PureComponent<Props, State> {
  state: State = {
    error: null,
    lookupAddress: '',
    name: '',
    recoveryPhrase: '',
    success: null
  };

  // Just adds the account, but user will need to unlock it later if they wish to use it.
  handleAddAccount = () => {
    // const { name, recoveryPhrase } = this.state;
    // FIXME: after saving, also display its status in a modal with options to do a balance transfer to it (need to unlock first)
    try {
      // const pair = keyring.createAccountMnemonic(recoveryPhrase, { name, isExternal: true });
      // console.log(pair);
      this.onSuccess('Successfully added account to wallet from recovery phrase!');
    } catch (e) {
      this.onError(e.message);
    }
  }

  handleInputName = ({ target: { value } }: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ name: value });
  }

  handleInputRecoveryPhrase = ({ target: { value } }: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ recoveryPhrase: value });
  }

  onError = (value: string | null) => {
    this.setState({ error: value, success: null });
  }

  onSuccess = (value: string | null) => {
    this.setState({ error: null, success: value });
  }

  render () {
    return (
      <WalletCard
        header='Wallet'
        subheader='Manage your secret keys' >
        <Margin top />
        <Stacked>
          <WithSpace>
            <SubHeader> Recovery Phrase </SubHeader>
            <Input
              onChange={this.handleInputRecoveryPhrase}
              type='text' />
            <Margin top />
            <SubHeader> Name </SubHeader>
            <Input
              onChange={this.handleInputName}
              type='text' />
          </WithSpace>
          <NavButton onClick={this.handleAddAccount} value='Add Account' />
        </Stacked>
        {this.renderError()}
        {this.renderSuccess()}
      </WalletCard>
    );
  }

  renderError () {
    const { error } = this.state;

    return (
      <ErrorText>
        {error || null}
      </ErrorText>
    );
  }

  renderSuccess () {
    const { success } = this.state;

    return (
      <SuccessText>
        {success || null}
      </SuccessText>
    );
  }
}
