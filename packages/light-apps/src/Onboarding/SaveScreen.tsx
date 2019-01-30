// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AddressSummary, ErrorText, Input, Modal, NavButton, NavLink, Stacked } from '@polkadot/ui-components';
import keyring from '@polkadot/ui-keyring';

import { inject } from 'mobx-react';
import React from 'react';
import { RouteComponentProps } from 'react-router-dom';

import { OnboardingStore } from '../stores/onboardingStore';

interface MatchParams {
  importMethod: string;
  importParam: string;
}

interface Props extends RouteComponentProps<MatchParams> {
  onboardingStore: OnboardingStore;
}

type State = {
  address?: string;
  error: string | null;
  name?: string;
  password: string;
  recoveryPhrase: string;
};

@inject('onboardingStore')
export class SaveScreen extends React.PureComponent<Props, State> {
  state: State = {
    error: null,
    name: '',
    password: '',
    recoveryPhrase: ''
  };

  componentDidMount () {
    const { match } = this.props;

    const importMethod = match.params.importMethod;
    const importParam = match.params.importParam;

    if (importMethod === 'withJson') {
      const json = JSON.parse(importParam);

      const address = json.address;
      const name = json.meta.name;

      this.setState({
        address,
        name
      });
    } else if (importMethod === 'withPhrase') {
      this.setState({
        recoveryPhrase: importParam
      });
    }
  }

  private saveToWallet = () => {
    const { name, recoveryPhrase, password } = this.state;
    const { history, match, onboardingStore: { setIsFirstRun } } = this.props;

    let pair;

    try {
      if (match.params.importMethod === 'withJson') {
        const json = JSON.parse(match.params.importParam);

        pair = keyring.restoreAccount(json, password);
      } else {
        pair = keyring.createAccountMnemonic(recoveryPhrase, password, { name });
      }

      setIsFirstRun(false);

      history.push(`/identity/${pair.address()}`);
    } catch (e) {
      this.onError(e.message);
    }
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
        {this.renderError()}
      </React.Fragment>
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
            <NavLink to='/import/withJson'> Import an existing account </NavLink>
          </Stacked>
        </Modal.Actions>
      </React.Fragment>
    );
  }
}
