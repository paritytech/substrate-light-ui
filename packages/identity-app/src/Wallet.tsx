// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AddressSummary, Container, ErrorText, Input, MarginTop, NavButton, Stacked, WalletCard, WithSpace } from '@polkadot/ui-components';
import keyring from '@polkadot/ui-keyring';

import React from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';

interface Props extends RouteComponentProps {
  basePath: string;
}

type State = {
  error: string | null,
  lookupAddress: string,
  name: string,
  recoveryPhrase: string
};

export class Wallet extends React.PureComponent<Props, State> {
  state: State = {
    error: null,
    lookupAddress: '',
    name: '',
    recoveryPhrase: ''
  };

  private handleAddAccount = () => {
    const { name, recoveryPhrase } = this.state;
    // FIXME: after saving, also display its status in a modal with options to do a balance transfer to it (need to unlock first)
    try {
      const pair = keyring.createAccountMnemonic(recoveryPhrase, { name, isExternal: true });
      console.log(pair);
    } catch (e) {
      this.onError(e.message);
    }
  }

  private handleInputName = ({ target: { value } }: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ name: value });
  }

  private handleInputRecoveryPhrase = ({ target: { value } }: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ recoveryPhrase: value });
  }

  private onError = (value: string | null) => {
    this.setState({
      error: value
    });
  }

  render () {
    return (
      <WalletCard
        header='Wallet'
        subheader='Manage your secret keys' >
        <Stacked>
          <WithSpace>
            <Input
              label='Recovery Phrase'
              onChange={this.handleInputRecoveryPhrase}
              type='text'
              withLabel />
            <MarginTop />
            <Input
              label='Name'
              onChange={this.handleInputName}
              type='text'
              withLabel />
          </WithSpace>
          <NavButton onClick={this.handleAddAccount} value='Create Account' />
        </Stacked>
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
}
