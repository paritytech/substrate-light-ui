// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { AppContext } from '@substrate/ui-common';
import { AddressSummary, ErrorText, Input, Modal, NavButton, NavLink, Stacked } from '@substrate/ui-components';

interface MatchParams {
  importMethod: string;
}

interface Props extends RouteComponentProps<MatchParams> { }

type State = {
  address?: string;
  error: string | null;
  jsonString: string;
  name?: string;
  password: string;
  recoveryPhrase: string;
};

export class SaveScreen extends React.PureComponent<Props, State> {
  static contextType = AppContext;

  context!: React.ContextType<typeof AppContext>; // http://bit.ly/typescript-and-react-context

  state: State = {
    error: null,
    jsonString: '',
    name: '',
    password: '',
    recoveryPhrase: ''
  };

  componentDidMount () {
    const { location, match } = this.props;

    const importMethod = match.params.importMethod;

    try {
      if (importMethod === 'withJson') {
        const json = JSON.parse(location.state.jsonString);

        const address = json.address;
        const name = json.meta.name;

        this.setState({
          address,
          jsonString: location.state.jsonString,
          name
        });
      } else if (importMethod === 'withPhrase') {
        this.setState({
          recoveryPhrase: location.state.recoveryPhrase
        });
      }
    } catch (e) {
      this.onError(e.message);
    }
  }

  saveToWallet = () => {
    const { keyring } = this.context;
    const { jsonString, name, recoveryPhrase, password } = this.state;
    const { history, match } = this.props;

    let pair;

    try {
      if (match.params.importMethod === 'withJson') {
        const json = JSON.parse(jsonString);

        pair = keyring.restoreAccount(json, password);
      } else {
        pair = keyring.createAccountMnemonic(recoveryPhrase, password, { name });
      }

      history.push(`/transfer/${pair.address()}`);
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

  onError = (value: string | null) => {
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
