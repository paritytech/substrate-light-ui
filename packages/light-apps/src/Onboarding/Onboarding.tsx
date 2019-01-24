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

    // For Debugging Purposes only
    if (process.env.NODE_ENV !== 'production') {
      // @ts-ignore
      window.keyring = keyring;
    }

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

  private toggleScreen = (to: OnboardingScreenType) => {
    this.setState({
      screen: to,
      password: ''
    });
  }

  private handleFileUploaded = async (file: Uint8Array) => {
    const {
      accountStore: { address, name, setIsImport, setJsonString }
    } = this.props;

    const jsonString = u8aToString(file);

    try {
      await setIsImport(true);
      await setJsonString(jsonString);

      this.setState({
        address,
        error: null,
        jsonString,
        name
      });

      this.toggleScreen('save');
    } catch (e) {
      console.error(e);
      this.onError(e.message);
      alert('Please resolve this before you continue: ' + e.message);
    }
  }

  private addAccountToWallet = async () => {
    const {
      history,
      onboardingStore: { setIsFirstRun },
      accountStore: { isImport, jsonString, recoveryPhrase, setAddress, setName }
    } = this.props;
    const { mnemonic, name, password } = this.state;

    if (!password) {
      this.onError('Password field cannot be empty');
      return;
    }

    let pair;

    try {
      if (!isImport) {
        pair = keyring.createAccountMnemonic(mnemonic, password, { name });

        const newAddress = pair.address();

        await setAddress(newAddress);
        await setName(name);

        const json = pair.toJson(password);
        const blob = new Blob([JSON.stringify(json)], { type: 'application/json; charset=utf-8' });

        FileSaver.saveAs(blob, `${newAddress}.json`);

        console.log('new pair generated from mnemonic -> ', pair);
      } else if (jsonString) {
        pair = keyring.restoreAccount(JSON.parse(jsonString), password);

        console.log('new pair generated from json -> ', pair);
      } else if (recoveryPhrase) {
        // FIXME: actually check it's a valid phrase
        if (recoveryPhrase.split(' ').length === 12) {
          this.onError(null);

          // FIXME: actually restore from the phrase

          console.log('new pair generated from phrase -> ', pair);

          this.toggleScreen('save');
        } else {
          this.onError('The entered Recovery Phrase is not valid.');
        }
      }
    } catch (e) {
      this.onError(e.message);
      return;
    }

    setIsFirstRun(false);

    history.push('/Identity');
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
                  addAccountToWallet={this.addAccountToWallet}
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
      <ErrorText>
        {error || null}
      </ErrorText>
    );
  }
}
