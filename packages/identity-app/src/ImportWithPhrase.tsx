// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ApiContext } from '@substrate/ui-api';
import { ErrorText, Input, Modal, Stacked } from '@substrate/ui-components';
import React from 'react';
import { RouteComponentProps } from 'react-router-dom';

interface Props extends RouteComponentProps { }

type State = {
  error?: string;
  name?: string;
  password: string;
  recoveryPhrase: string;
};

export class ImportWithPhrase extends React.PureComponent<Props> {
  static contextType = ApiContext;

  context!: React.ContextType<typeof ApiContext>;

  state: State = {
    name: '',
    password: '',
    recoveryPhrase: ''
  };

  handleUnlockWithPhrase = () => {
    const { keyring } = this.context;
    const { name, password, recoveryPhrase } = this.state;
    const { history } = this.props;

    if (!password) {
      this.onError('Please enter the password you used to create this account');
      return false;
    }

    try {
      if (recoveryPhrase && recoveryPhrase.split(' ').length === 12) {
        keyring.createAccountMnemonic(recoveryPhrase, password);
      } else {
        this.onError('Invalid phrase. Please check it and try again.');
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
      <Stacked justify='space-between'>
        <Modal.SubHeader> Import Account from Mnemonic Recovery Phrase </Modal.SubHeader>
        <Input
          onChange={this.onChangePhrase}
          type='text'
          value={recoveryPhrase} />
        <Input
          onChange={this.onChangeName}
          type='text'
          value={name} />
        <Input
          onChange={this.onChangePassword}
          type='password'
          value={password} />
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
