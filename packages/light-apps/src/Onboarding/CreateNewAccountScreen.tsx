// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { mnemonicGenerate, mnemonicToSeed, naclKeypairFromSeed } from '@polkadot/util-crypto';
import { AppContext } from '@substrate/ui-common';
import { AddressSummary, ErrorText, FadedText, Input, Margin, MnemonicSegment, NavButton, Stacked, StackedHorizontal, StyledLinkButton, SubHeader, WithSpaceAround } from '@substrate/ui-components';
import FileSaver from 'file-saver';
import React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import Modal from 'semantic-ui-react/dist/commonjs/modules/Modal/Modal';

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
  static contextType = AppContext;

  context!: React.ContextType<typeof AppContext>; // http://bit.ly/typescript-and-react-context

  state: State = {
    error: null,
    mnemonic: '',
    name: '',
    password: '',
    rewritePhrase: '',
    step: 'create'
  };

  componentDidMount () {
    this.newMnemonic();
  }

  createNewAccount = () => {
    const { keyring } = this.context;
    const { history } = this.props;
    const { mnemonic, name, password } = this.state;

    if (this.validateFields()) {
      const result = keyring.addUri(mnemonic.trim(), password, { name });

      const address = result.pair.address;
      const json = result.json;
      const blob = new Blob([JSON.stringify(json)], { type: 'application/json; charset=utf-8' });

      FileSaver.saveAs(blob, `${address}.json`);

      history.push(`/transfer/${address}`);
    } else {
      this.onError('Please make sure all the fields are set');
    }
  }

  generateAddressFromMnemonic (mnemonic: string): string {
    const { keyring } = this.context;
    const keypair = naclKeypairFromSeed(mnemonicToSeed(mnemonic));

    return keyring.encodeAddress(
      keypair.publicKey
    );
  }

  newMnemonic = () => {
    const mnemonic = mnemonicGenerate();
    const address = this.generateAddressFromMnemonic(mnemonic);

    this.setState({ address, mnemonic });
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

  onChangeRewritePhrase = ({ target: { value } }: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      rewritePhrase: value
    });

    if (value === this.state.mnemonic) {
      this.onError('');
    } else {
      this.onError('Mnemonic does not match rewrite');
    }
  }

  onError = (value: string | null) => {
    this.setState({
      error: value
    });
  }

  toggleStep = () => {
    const { address, password, step } = this.state;

    if (address && password) {
      this.setState({
        step: step === 'create' ? 'rewrite' : 'create'
      });
    } else {
      this.onError('Please make sure all fields are set.');
    }
  }

  validateFields = () => {
    const { mnemonic, name, password, rewritePhrase } = this.state;
    return mnemonic.length && name && password.length && rewritePhrase === mnemonic;
  }

  render () {
    const { step } = this.state;

    return (
      <React.Fragment>
        <Icon name='arrow left' onClick={this.props.history.goBack} />
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
        <SubHeader> Create from the following mnemonic phrase </SubHeader>
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
          <NavButton onClick={this.toggleStep}> Next </NavButton>
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
          <Margin top />
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
        <SubHeader> Give it a name </SubHeader>
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
        <SubHeader> Encrypt it with a passphrase </SubHeader>
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
