// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { AppContext } from '@substrate/ui-common';
import { ErrorText, Input, Margin, Modal, NavButton, Stacked, WrapperDiv } from '@substrate/ui-components';

interface Props extends RouteComponentProps { }

type State = {
  error?: string;
  name?: string;
  password: string;
  recoveryPhrase: string;
};

export class ImportWithPhrase extends React.PureComponent<Props> {
  static contextType = AppContext;

  context!: React.ContextType<typeof AppContext>;

  state: State = {
    name: '',
    password: '',
    recoveryPhrase: ''
  };

  handleUnlockWithPhrase = () => {
    const { keyring } = this.context;
    const { name, password, recoveryPhrase } = this.state;
    const { history } = this.props;

    try {
      if (!password) {
        throw new Error('Please enter the password you used to create this account');
      }

      if (recoveryPhrase && recoveryPhrase.split(' ').length === 12) {
        const meta = { name: name };

        let pair = keyring.createAccountMnemonic(recoveryPhrase, password, meta);

        history.push(`identity/${pair.address()}`);
      } else {
        throw new Error('Invalid phrase. Please check it and try again.');
      }
    } catch (e) {
      this.onError(e.message);
    }
  }

  onChangeName = ({ target: { value } }: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      name: value
    });
  }

  onChangePassword = ({ target: { value } }: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      password: value
    });
  }

  onChangePhrase = ({ target: { value } }: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      recoveryPhrase: value
    });
  }

  onError = (value: string) => {
    this.setState({
      error: value
    });
  }

  render () {
    const { name, password, recoveryPhrase } = this.state;

    return (
      <Stacked justifyContent='space-between'>
        <Modal.SubHeader> Import Account from Mnemonic Recovery Phrase </Modal.SubHeader>
        <WrapperDiv width='40rem'>
          <Input
            fluid
            label='Phrase'
            onChange={this.onChangePhrase}
            type='text'
            value={recoveryPhrase} />
          <Margin top />
          <Input
            fluid
            label='Name'
            onChange={this.onChangeName}
            type='text'
            value={name} />
          <Margin top />
          <Input
            fluid
            label='Password'
            onChange={this.onChangePassword}
            type='password'
            value={password} />
        </WrapperDiv>
        <Margin top />
        <NavButton onClick={this.handleUnlockWithPhrase} value='Restore' />
        {this.renderError()}
      </Stacked>
    );
  }

  renderError () {
    const { error } = this.state;

    return (
      <ErrorText>
        {error}
      </ErrorText>
    );
  }
}
