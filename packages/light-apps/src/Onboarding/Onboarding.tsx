// Copyright 2017-2018 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import { inject, observer } from 'mobx-react';
import { RouteComponentProps } from 'react-router-dom';
import keyring from '@polkadot/ui-keyring';

import { mnemonicGenerate, mnemonicToSeed, naclKeypairFromSeed } from '@polkadot/util-crypto';
import { AddressSummary, Container, ErrorText, FadedText, Input, Modal, NavButton, NavLink, Segment, Stacked } from '@polkadot/ui-components';
import FileSaver from 'file-saver';

import { OnboardingStore } from '../stores/onboardingStore';
import { AccountStore } from '../stores/accountStore';
import { ImportOptionsScreen } from './ImportOptionsScreen';

interface Props extends RouteComponentProps {
  onboardingStore: OnboardingStore;
  accountStore: AccountStore;
}

export type OnboardingScreenType = 'importOptions' | 'save' | 'new';

type State = {
  address?: string,
  error: string | null,
  jsonString: string | null,
  mnemonic: string,
  name?: string,
  recoveryPhrase: string | null,
  password?: string,
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
    jsonString: null,
    mnemonic: '',
    recoveryPhrase: null,
    screen: 'importOptions'
  };

  componentDidMount () {
    const mnemonic = generatePhrase();
    const address = generateAddressFromPhrase(mnemonic);

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

  onChangePhrase = ({ target: { value } }: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      recoveryPhrase: value
    });
  }

  toggleScreen = (to: OnboardingScreenType) => {
    this.setState({
      screen: to,
      password: ''
    });
  }

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
          {screen === 'new'
            ? this.renderNewAccountScreen()
            : screen === 'importOptions'
              ? <ImportOptionsScreen toggleScreen={this.toggleScreen}
              {...this.props}/>
              : this.renderSaveScreen()
          }
          {
            this.renderError()
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
          type='text'
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

  renderNewAccountActions () {
    return (
      <React.Fragment>
        <Modal.Actions>
          <Stacked>
            <NavButton onClick={this.addAccountToWallet}> Save </NavButton>
            <Modal.FadedText>or</Modal.FadedText>
            <NavLink onClick={() => this.toggleScreen('importOptions')}> Import an existing account </NavLink>
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
