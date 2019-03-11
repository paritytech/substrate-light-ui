// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { mnemonicGenerate, mnemonicToSeed, naclKeypairFromSeed } from '@polkadot/util-crypto';
import { ApiContext } from '@substrate/ui-api';
import { AddressSummary, ErrorText, FadedText, Input, MarginTop, MnemonicSegment, Modal, NavButton, NavLink, Stacked, StackedHorizontal, StyledLinkButton, SubHeader, WithSpaceAround } from '@substrate/ui-components';
import FileSaver from 'file-saver';
import React from 'react';
import { RouteComponentProps } from 'react-router-dom';

interface Props extends RouteComponentProps { }

type Steps = 'create' | 'rewrite';

type State = {
  address?: string;
  error: string | null;
  mnemonic: string;
  name: string;
  password: string;
  rewritePhrase?: string;
  step: Steps;
};

export class CreateNewAccountScreen extends React.PureComponent<Props, State> {
  static contextType = ApiContext;

  context!: React.ContextType<typeof ApiContext>; // http://bit.ly/typescript-and-react-context

  state: State = {
    error: null,
    mnemonic: '',
    name: '',
    password: '',
    rewritePhrase: '',
    step: 'create'
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

  private onChangeRewritePhrase = ({ target: { value } }: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      rewritePhrase: value
    });

    if (value === this.state.mnemonic) {
      this.onError('');
    } else {
      this.onError('Mnemonic does not match rewrite');
    }
  }

  private onError = (value: string | null) => {
    this.setState({
      error: value
    });
  }
  private toggleStep = () => {
    const { address, password, step } = this.state;

    if (address && password) {
      this.setState({
        step: step === 'create' ? 'rewrite' : 'create'
      });
    } else {
      this.onError('Please make sure all fields are set.');
    }
  }

  private validateFields = () => {
    const { mnemonic, name, password, rewritePhrase } = this.state;
    return mnemonic.length && name && password.length && rewritePhrase === mnemonic;
  }

  render () {
    const { step } = this.state;

    return (
      <React.Fragment>
        <Modal.Header> Create New Account </Modal.Header>
        <Modal.Content>
          {
            step === 'create'
              ? this.renderCreateStep()
              : this.renderRewriteStep()
          }
        </Modal.Content>
      </React.Fragment>
    );
  }

  renderCreateStep () {
    const { address, mnemonic, name } = this.state;

    return (
      <Stacked>
        <AddressSummary address={address} name={name} />
        {this.renderSetName()}
        <Modal.SubHeader> Create from the following mnemonic phrase </Modal.SubHeader>
        <MnemonicSegment onClick={this.newMnemonic} mnemonic={mnemonic} />
        {this.renderSetPassword()}
        {this.renderError()}
        {this.renderNewAccountActions()}
      </Stacked>
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

  renderNewAccountActions () {
    return (
      <React.Fragment>
        <Modal.Actions>
          <Stacked>
            <NavButton onClick={this.toggleStep}> Next </NavButton>
            <Modal.FadedText>or</Modal.FadedText>
            <NavLink to='/import/withJson'> Import an existing account </NavLink>
          </Stacked>
        </Modal.Actions>
      </React.Fragment>
    );
  }

  renderRewriteStep () {
    const { mnemonic, rewritePhrase } = this.state;

    return (
      <React.Fragment>
        <Stacked>
          <SubHeader> Copy Your Mnemonic Somewhere Safe </SubHeader>
          <FadedText> If someone gets hold of this mnemonic they could drain your account</FadedText>
          <MnemonicSegment onClick={this.newMnemonic} mnemonic={mnemonic} />
          <MarginTop />
          <FadedText> Rewrite Mnemonic Below </FadedText>
          <Input
            autoFocus
            fluid
            onChange={this.onChangeRewritePhrase}
            type='text'
            value={rewritePhrase} />
          <WithSpaceAround>
            <StackedHorizontal>
              <StyledLinkButton onClick={this.toggleStep}> Back </StyledLinkButton>
              <NavButton onClick={this.createNewAccount}> Save </NavButton>
            </StackedHorizontal>
          </WithSpaceAround>
        </Stacked>
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
}
