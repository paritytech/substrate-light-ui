// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AddressSummary, Input, Modal, NavButton, NavLink, Stacked } from '@polkadot/ui-components';
import keyring from '@polkadot/ui-keyring';
import React from 'react';
import { RouteComponentProps } from 'react-router-dom';

interface Props extends RouteComponentProps {
  jsonString?: string;
  phrase?: string;
}

type State = {
  address?: string;
  error: string | null;
  name?: string;
  password: string;
  recoveryPhrase: string;
};

export class SaveScreen extends React.Component<Props> {
  state: State = {
    error: null,
    name: '',
    password: '',
    recoveryPhrase: ''
  };

  private saveToWallet = () => {
    const { name, recoveryPhrase, password } = this.state;

    const pair = keyring.createAccountMnemonic(recoveryPhrase, password, { name });

    console.log(pair);

    this.onError(null);
  }

  private onChangeName = ({ target: { value } }: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      name: value
    });
  }

  private onChangePassword = ({ target: { value } }: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      password: value
    });
  }

  private onError = (value: string | null) => {
    this.setState({
      error: value
    });
  }

  render () {
    const { address, name } = this.state;

    return (
      <React.Fragment>
        <Modal.Header> Unlock and Save </Modal.Header>
        <Modal.Content>
          <Stacked>
            <AddressSummary address={address} name={name} />
            {this.renderSetName()}
            {this.renderSetPassword()}
          </Stacked>
        </Modal.Content>
        {this.renderNewAccountActions()}
      </React.Fragment>
    );
  }

  renderSetName () {
    const { name } = this.state;

    return (
      <React.Fragment>
        <Modal.SubHeader> Give it a name </Modal.SubHeader>
        <Input
          autoFocus
          onChange={this.onChangeName}
          type='text'
          value={name}
        />
      </React.Fragment>
    );
  }

  renderSetPassword () {
    const { password } = this.state;

    return (
      <React.Fragment>
        <Modal.SubHeader> Encrypt it with a passphrase </Modal.SubHeader>
        <Input
          onChange={this.onChangePassword}
          type='password'
          value={password}
        />
      </React.Fragment>
    );
  }

  renderNewAccountActions () {
    return (
      <React.Fragment>
        <Modal.Actions>
          <Stacked>
            <NavButton onClick={this.saveToWallet}> Save </NavButton>
            <Modal.FadedText>or</Modal.FadedText>
            <NavLink to='/import'> Import an existing account </NavLink>
          </Stacked>
        </Modal.Actions>
      </React.Fragment>
    );
  }
}
