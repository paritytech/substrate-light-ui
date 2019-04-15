// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { mnemonicGenerate, mnemonicToSeed, naclKeypairFromSeed } from '@polkadot/util-crypto';
import { AppContext } from '@substrate/ui-common';
import { AddressSummary, ErrorText, FadedText, Input, Margin, MnemonicSegment, NavButton, Stacked, StyledLinkButton, SubHeader, WideDiv, WithSpaceAround } from '@substrate/ui-components';
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

export class Create extends React.PureComponent<Props, State> {
  static contextType = AppContext;

  context!: React.ContextType<typeof AppContext>; // http://bit.ly/typescript-and-react-context

  state: State = {
    error: null,
    mnemonic: '',
    name: '',
    password: '',
    step: 'create'
  };

  componentDidMount () {
    this.newMnemonic();
  }

  clearFields = () => {
    const mnemonic = mnemonicGenerate();

    this.setState({
      address: this.generateAddressFromMnemonic(mnemonic),
      error: null,
      mnemonic,
      name: '',
      password: ''
    });
  }

  createNewAccount = () => {
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

      this.clearFields();
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
    const { address, name, step } = this.state;

    return (
      <Stacked>
        <AddressSummary address={address} name={name} />
        <Margin top />
        {
          step === 'create'
            ? this.renderCreateStep()
            : this.renderRewriteStep()
        }
        {this.renderError()}
      </Stacked>
    );
  }

  renderCreateStep () {
    const { mnemonic } = this.state;

    return (
      <React.Fragment>
        <Stacked>
          <SubHeader> Create from the following mnemonic phrase </SubHeader>
          <MnemonicSegment onClick={this.newMnemonic} mnemonic={mnemonic} />
          <Margin top />
          <Stacked>
            {this.renderSetName()}
            <Margin top />
            {this.renderSetPassword()}
          </Stacked>
          <NavButton onClick={this.toggleStep}> Next </NavButton>
        </Stacked>
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
          <WideDiv>
            <Input
              autoFocus
              fluid
              onChange={this.onChangeRewritePhrase}
              type='text'
              value={rewritePhrase} />
          </WideDiv>
          <WithSpaceAround>
            <Stacked>
              <StyledLinkButton onClick={this.toggleStep}> Back </StyledLinkButton>
              <Margin top />
              <NavButton onClick={this.createNewAccount}> Save </NavButton>
            </Stacked>
          </WithSpaceAround>
        </Stacked>
      </React.Fragment>
    );
  }

  renderSetName () {
    const { name } = this.state;

    return (
      <Stacked>
        <SubHeader> Give it a name </SubHeader>
        <WideDiv>
          <Input
            autoFocus
            fluid
            min={1}
            onChange={this.onChangeName}
            type='text'
            value={name}
          />
        </WideDiv>
      </Stacked>
    );
  }

  renderSetPassword () {
    const { password } = this.state;

    return (
      <Stacked>
        <SubHeader> Encrypt it with a passphrase </SubHeader>
        <WideDiv>
          <Input
            fluid
            min={8}
            onChange={this.onChangePassword}
            type='password'
            value={password}
          />
        </WideDiv>
      </Stacked>
    );
  }

}
