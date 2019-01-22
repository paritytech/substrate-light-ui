// Copyright 2017-2018 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import { inject, observer } from 'mobx-react';
import { RouteComponentProps } from 'react-router-dom';
import keyring from '@polkadot/ui-keyring';
import { u8aToString } from '@polkadot/util';
import { mnemonicGenerate, mnemonicToSeed, naclKeypairFromSeed } from '@polkadot/util-crypto';
import { AddressSummary, Container, ErrorText, FadedText, Input, InputFile, Modal, NavButton, NavLink, Segment, Stacked } from '@polkadot/ui-components';
import FileSaver from 'file-saver';

import { OnboardingStore } from '../stores/onboardingStore';
import { AccountStore } from '../stores/accountStore';

interface Props extends RouteComponentProps {
  onboardingStore: OnboardingStore;
  accountStore: AccountStore;
}

type OnboardingScreenType = 'importOptions' | 'save' | 'new';

type State = {
  address?: string,
  error: string | null,
  jsonString?: string,
  mnemonic: string,
  name?: string,
  password?: string,
  recoveryPhrase?: string,
  screen: OnboardingScreenType
};

function generatePhrase (): string {
  const phrase = mnemonicGenerate();
  return phrase;
}

function generateAddressFromPhrase (phrase: string): string {
  const keypair = naclKeypairFromSeed(mnemonicToSeed(phrase));
  keyring.loadAll();
  return keyring.encodeAddress(
    keypair.publicKey
  );
}

@inject('onboardingStore')
@inject('accountStore')
@observer
export class Onboarding extends React.Component<Props, State> {
  state: State = {
    error: null,
    screen: 'importOptions',
    mnemonic: ''
  };

  componentDidMount () {
    const mnemonic = generatePhrase();
    const address = generateAddressFromPhrase(mnemonic);

    this.setState({ address, mnemonic });
  }

  handleInputRecoveryPhrase = ({ target: { value } }: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      recoveryPhrase: value
    });
  }

  handleFileUploaded = async (file: Uint8Array) => {
    const { accountStore } = this.props;

    const jsonString = u8aToString(file);

    try {
      await accountStore.setIsImport(true);
      await accountStore.setJsonString(jsonString);

      this.setState({
        address: accountStore.address,
        error: null,
        jsonString: jsonString,
        name: accountStore.name,
        screen: 'save'
      });
    } catch (e) {
      console.error(e);
      this.setState({ error: e.message });
      alert('You need to resolve this issue first: ' + e.message);
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

  onChangePhrase = ({ target: { value } }: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      recoveryPhrase: value
    });
  }

  toggleScreen = () => {
    const { screen } = this.state;
    this.setState({
      screen: screen === 'new' || screen === 'save'
        ? 'importOptions'
        : 'new',
      password: ''
    });
  }

  unlockWithPhrase = () => {
    const { error } = this.state;
    if (error) {
      alert('You need to resolve this issue before continuing: ' + error);
    } else {
      this.setState({
        screen: 'save',
        password: ''
      });
    }
  }

  // FIXME: split this up into smaller functions
  addAccountToWallet = async (file?: Uint8Array) => {
    const {
      history,
      onboardingStore: { setIsFirstRun },
      accountStore: { isImport, setAddress, setRecoveryPhrase }
    } = this.props;
    const { jsonString, mnemonic, name, password, recoveryPhrase } = this.state;

    if (!password) {
      this.setState({ error: 'Password field cannot be empty' });
      return;
    }

    if (!isImport) {
      const pair = keyring.createAccountMnemonic(mnemonic, password, { name });

      const json = pair.toJson(password);
      const blob = new Blob([JSON.stringify(json)], { type: 'application/json; charset=utf-8' });

      FileSaver.saveAs(blob, `${pair.address()}.json`);
    }

    try {
      if (recoveryPhrase) {
        await setRecoveryPhrase(recoveryPhrase);
      } else if (jsonString) {
        const pair = keyring.restoreAccount(JSON.parse(jsonString), password);

        await setAddress(pair.address());
      }

      setIsFirstRun(false);

      history.push('/Identity');
    } catch (e) {
      console.error(e);
      this.setState({ error: e.message });
    }
  }

  render () {
    const { screen } = this.state;

    return (
      <Modal
        dimmer='inverted'
        open
        size='tiny'
      >
        <Container>
          {
            this.renderError()
          }
          {screen === 'new'
            ? this.renderNewAccountScreen()
            : screen === 'importOptions'
              ? this.renderImportOptionsScreen()
              : this.renderSaveScreen()
          }
        </Container>
      </Modal>
    );
  }

  renderError () {
    const { error } = this.state;

    return (
      <React.Fragment>
        <ErrorText>
          {error || null}
        </ErrorText>
      </React.Fragment>
    );
  }

  renderImportOptionsScreen () {
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

  renderNewAccountScreen () {
    const { address, name, mnemonic } = this.state;

    return (
      <React.Fragment>
        <Modal.Header> Create New Account </Modal.Header>
        <Modal.Content>
          <Stacked>
            <AddressSummary address={address} name={name} />
            {this.renderSetName()}
            <Modal.SubHeader> Create from the following mnemonic phrase </Modal.SubHeader>
            <Segment> <FadedText> {mnemonic} </FadedText> </Segment>
            {this.renderSetPassword()}
            {this.renderNewAccountActions()}
          </Stacked>
        </Modal.Content>
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
          value={name}
        />
      </React.Fragment>
    );
  }

  renderSetPassword () {
    const { password, screen } = this.state;

    return (
      <React.Fragment>
        <Modal.SubHeader> {screen === 'save' ? 'Decrypt your account with your passphrase' : 'Encrypt it with a passphrase'} </Modal.SubHeader>
        <Input
          onChange={this.onChangePassword}
          type='password'
          value={password}
        />
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
          onChange={this.handleInputRecoveryPhrase}
          value={recoveryPhrase} />
      </React.Fragment>
    );
  }

  renderImportActions () {
    return (
      <Modal.Actions>
        <Stacked>
          <NavButton onClick={this.unlockWithPhrase}>Unlock</NavButton>
          <Modal.FadedText>or</Modal.FadedText>
          <NavLink onClick={this.toggleScreen}> Create New Account </NavLink>
        </Stacked>
      </Modal.Actions>
    );
  }

  renderNewAccountActions () {
    return (
      <React.Fragment>
        <Modal.Actions>
          <Stacked>
            <NavButton onClick={this.addAccountToWallet}> Save </NavButton>
            <Modal.FadedText>or</Modal.FadedText>
            <NavLink onClick={this.toggleScreen}> Import an existing account </NavLink>
          </Stacked>
        </Modal.Actions>
      </React.Fragment>
    );
  }

  renderSaveScreen () {
    const { address, name } = this.state;
    return (
      <React.Fragment>
        <Modal.Header> Unlock Account </Modal.Header>
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
}
