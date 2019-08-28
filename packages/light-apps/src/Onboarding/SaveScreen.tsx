// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AppContext } from '@substrate/ui-common';
import { AddressSummary, ErrorText, FadedText, Input, NavButton, NavLink, Stacked, SubHeader } from '@substrate/ui-components';
import React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import Modal from 'semantic-ui-react/dist/commonjs/modules/Modal/Modal';

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
        pair = keyring.addUri(recoveryPhrase.trim(), password, { name }).pair;
      }

      history.push(`/transfer/${pair.address}`);
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
        <SubHeader> Give it a name </SubHeader>
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
        <SubHeader> Encrypt it with a passphrase </SubHeader>
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
            <FadedText>or</FadedText>
            <NavLink to='/import/withJson'> Import an existing account </NavLink>
          </Stacked>
        </Modal.Actions>
      </React.Fragment>
    );
  }
}
