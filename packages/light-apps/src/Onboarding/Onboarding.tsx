// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import { inject, observer } from 'mobx-react';
import { RouteComponentProps } from 'react-router-dom';
import keyring from '@polkadot/ui-keyring';
import { u8aToString } from '@polkadot/util';
import { mnemonicGenerate, mnemonicToSeed, naclKeypairFromSeed } from '@polkadot/util-crypto';
import { Container, ErrorText, Modal } from '@polkadot/ui-components';
import FileSaver from 'file-saver';

import { OnboardingStore } from '../stores/onboardingStore';
import { AccountStore } from '../stores/accountStore';
import { CreateNewAccountScreen, ImportOptionsScreen, SaveScreen } from './index';

interface Props extends RouteComponentProps {
  onboardingStore: OnboardingStore;
  accountStore: AccountStore;
}

export type OnboardingScreenType = 'importOptions' | 'save' | 'new';

type State = {
  address?: string,
  error: string | null,
  jsonString?: string,
  mnemonic: string,
  name?: string,
  recoveryPhrase?: string,
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
    mnemonic: '',
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

  onError = (value: string | null) => {
    this.setState({
      error: value
    });
  }

  toggleScreen = (to: OnboardingScreenType) => {
    this.setState({
      screen: to,
      password: ''
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
        name: accountStore.name
      });

      this.toggleScreen('save');
    } catch (e) {
      console.error(e);
      this.onError(e.message);
      alert('Please resolve this before you continue: ' + e.message);
    }
  }

  addAccountFromJson = async (file?: Uint8Array) => {
    const {
      history,
      onboardingStore: { setIsFirstRun },
      accountStore: { setAddress }
    } = this.props;

    const { jsonString, password } = this.state;

    if (!password) {
      this.setState({ error: 'Password field cannot be empty' });
      return;
    } else if (jsonString) {
      const pair = keyring.restoreAccount(JSON.parse(jsonString), password);
      await setAddress(pair.address());

      setIsFirstRun(false);

      history.push('/Identity');
    } else {
      this.setState({ error: 'Make sure your JSON file is valid' });
    }
  }

  addAccountToWallet = () => {
    const {
      history,
      onboardingStore: { setIsFirstRun },
      accountStore: { isImport }
    } = this.props;
    const { mnemonic, name, password } = this.state;
    debugger;
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
      setIsFirstRun(false);

      history.push('/Identity');
    } catch (e) {
      console.error(e);
      this.setState({ error: e.message });
    }
  }

  render () {
    const { address, mnemonic, name, password, recoveryPhrase, screen } = this.state;

    return (
      <Modal
        dimmer='inverted'
        open
        size='tiny'
      >
        <Container>
          {screen === 'new'
            ? <CreateNewAccountScreen
                addAccountToWallet={this.addAccountToWallet}
                address={address}
                mnemonic={mnemonic}
                name={name}
                onChangeName={this.onChangeName}
                onChangePassword={this.onChangePassword}
                onError={this.onError}
                password={password}
                toggleScreen={this.toggleScreen}
                {...this.props} />
            : screen === 'importOptions'
              ? <ImportOptionsScreen
                  address={address}
                  onChangePhrase={this.onChangePhrase}
                  onChangeFile={this.handleFileUploaded}
                  onError={this.onError}
                  name={name}
                  recoveryPhrase={recoveryPhrase}
                  toggleScreen={this.toggleScreen}
                  {...this.props} />
              : <SaveScreen
                  addAccountToWallet={this.addAccountToWallet}
                  address={address}
                  mnemonic={mnemonic}
                  name={name}
                  onChangeName={this.onChangeName}
                  onChangePassword={this.onChangePassword}
                  onError={this.onError}
                  password={password}
                  toggleScreen={this.toggleScreen}
                  {...this.props}/>
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
}
