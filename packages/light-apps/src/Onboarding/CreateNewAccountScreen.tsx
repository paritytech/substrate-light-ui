// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { mnemonicGenerate, mnemonicToSeed, naclKeypairFromSeed } from '@polkadot/util-crypto';
import { ApiContext } from '@substrate/ui-api';
import { AddressSummary, ErrorText, Input, MnemonicSegment, Modal, NavButton, NavLink, Stacked } from '@substrate/ui-components';
import FileSaver from 'file-saver';
import React from 'react';
import { RouteComponentProps } from 'react-router-dom';

interface Props extends RouteComponentProps { }

type State = {
  address?: string;
  error: string | null;
  mnemonic: string;
  name: string;
  password: string;
};

export class CreateNewAccountScreen extends React.PureComponent<Props, State> {
  static contextType = ApiContext;

  context!: React.ContextType<typeof ApiContext>; // http://bit.ly/typescript-and-react-context

  state: State = {
    error: null,
    mnemonic: '',
    name: '',
    password: ''
  };

  componentDidMount () {
    const mnemonic = mnemonicGenerate();
    const address = this.generateAddressFromMnemonic(mnemonic);

    this.setState({ address, mnemonic });
  }

  private createNewAccount = () => {
    const { keyring } = this.context;
    const { history } = this.props;
    const { mnemonic, name, password } = this.state;

    if (this.validateFields()) {
      let pair = keyring.createAccountMnemonic(mnemonic, password, { name });

      const address = pair.address();
      const json = pair.toJson(password);
      const blob = new Blob([JSON.stringify(json)], { type: 'application/json; charset=utf-8' });

      FileSaver.saveAs(blob, `${address}.json`);

      history.push(`/identity/${address}`);
    } else {
      this.onError('Please make sure all the fields are set');
    }
  }

  private generateAddressFromMnemonic (mnemonic: string): string {
    const { keyring } = this.context;
    const keypair = naclKeypairFromSeed(mnemonicToSeed(mnemonic));

    return keyring.encodeAddress(
      keypair.publicKey
    );
  }

  private newMnemonic = () => {
    const mnemonic = mnemonicGenerate();
    const address = this.generateAddressFromMnemonic(mnemonic);

    this.setState({ address, mnemonic });
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

  private validateFields = () => {
    const { mnemonic, name, password } = this.state;
    return mnemonic.length && name && password.length;
  }

  render () {
    const { address, mnemonic, name } = this.state;

    return (
      <React.Fragment>
        <Modal.Header> Create New Account </Modal.Header>
        <Modal.Content>
          <Stacked>
            <AddressSummary address={address} name={name} />
            {this.renderSetName()}
            <Modal.SubHeader> Create from the following mnemonic phrase </Modal.SubHeader>
            <MnemonicSegment onClick={this.newMnemonic} mnemonic={mnemonic} />
            {this.renderSetPassword()}
            {this.renderError()}
            {this.renderNewAccountActions()}
          </Stacked>
        </Modal.Content>
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
          min={1}
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
          min={8}
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
            <NavButton onClick={this.createNewAccount}> Save </NavButton>
            <Modal.FadedText>or</Modal.FadedText>
            <NavLink to='/import/withJson'> Import an existing account </NavLink>
          </Stacked>
        </Modal.Actions>
      </React.Fragment>
    );
  }
}
