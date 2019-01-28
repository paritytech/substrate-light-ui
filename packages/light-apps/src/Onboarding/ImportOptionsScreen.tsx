// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Input, InputFile, Modal, NavButton, NavLink, Stacked } from '@polkadot/ui-components';
import { u8aToString } from '@polkadot/util';

import React from 'react';
import { RouteComponentProps } from 'react-router-dom';

interface Props extends RouteComponentProps {}

type State = {
  error: string | null;
  jsonString?: string;
  recoveryPhrase: string;
};

export class ImportOptionsScreen extends React.Component<Props, State> {
  state: State = {
    error: null,
    recoveryPhrase: ''
  };

  private handleFileUploaded = async (file: Uint8Array) => {
    const { history } = this.props;

    const jsonString = u8aToString(file);

    try {
      this.onError(null);

      this.setState({ jsonString });

      history.push('/save/withJson');
    } catch (e) {
      this.onError(e.message);
      alert('Please resolve this before you continue: ' + e.message);
    }
  }

  private handleUnlockWithPhrase = () => {
    const { recoveryPhrase } = this.state;

    console.log(recoveryPhrase);
  }

  private onChangePhrase = ({ target: { value } }: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      recoveryPhrase: value
    });
  }

  private onError = (value: string | null) => {
    this.setState({
      error: value
    });
  }

  render () {
    return (
      <React.Fragment>
        <Modal.Header> Unlock Account </Modal.Header>
        <Modal.Content>
          <Stacked>
            {this.renderJSONCard()}
            <Modal.FadedText> or </Modal.FadedText>
            {this.renderPhraseCard()}
            {this.renderImportActions()}
          </Stacked>
        </Modal.Content>
      </React.Fragment>
    );
  }

  renderJSONCard () {
    return (
      <React.Fragment>
        <Modal.SubHeader> Restore Account from JSON Backup File </Modal.SubHeader>
        <InputFile onChange={this.handleFileUploaded} />
      </React.Fragment>
    );
  }

  renderPhraseCard () {
    const { recoveryPhrase } = this.state;

    return (
      <React.Fragment>
        <Modal.SubHeader> Import Account from Mnemonic Recovery Phrase </Modal.SubHeader>
        <Input
          onChange={this.onChangePhrase}
          type='text'
          value={recoveryPhrase} />
      </React.Fragment>
    );
  }

  renderImportActions () {
    return (
      <Modal.Actions>
        <Stacked>
          <NavButton onClick={this.handleUnlockWithPhrase}>Unlock</NavButton>
          <Modal.FadedText>or</Modal.FadedText>
          <NavLink to='/create'> Create New Account </NavLink>
        </Stacked>
      </Modal.Actions>
    );
  }
}
