// Copyright 2017-2018 @polkadot/light-apps authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import { withRouter, RouteComponentProps } from 'react-router';
import { inject, observer } from 'mobx-react';
import keyring from '@polkadot/ui-keyring';
import { mnemonicGenerate, mnemonicToSeed, naclKeypairFromSeed } from '@polkadot/util-crypto';
import { AddressSummary, Container, FadedText, Input, InputFile, Modal, NavButton, NavLink, Segment, Stacked } from '@polkadot/ui-components';

import { OnboardingStoreInterface } from '../stores/interfaces';

type Props = RouteComponentProps & {
  onboardingStore?: OnboardingStoreInterface
};

type OnboardingScreenType = 'unlock' | 'new';

type State = {
  address?: string,
  isBipBusy: boolean,
  name?: string,
  password?: string,
  phrase?: string,
  file?: Uint8Array,
  screen: OnboardingScreenType,
  seed?: string
};

function generateSeed (): string {
  const seed = mnemonicGenerate();
  return seed;
}

function generateAddressFromSeed (seed: string): string {
  const keypair = naclKeypairFromSeed(mnemonicToSeed(seed));
  keyring.loadAll();
  return keyring.encodeAddress(
    keypair.publicKey
  );
}

@(withRouter as any)
@inject('onboardingStore')
@observer
export class Onboarding extends React.Component<Props, State> {
  state: State = {
    isBipBusy: true,
    screen: 'unlock'
  };

  componentDidMount () {
    const seed = generateSeed();
    const address = generateAddressFromSeed(seed);

    this.setState({
      address: address,
      isBipBusy: false,
      seed: seed
    });
  }

  handleInputSeedPhrase = (val: string) => {
    this.setState({
      phrase: val
    });
  }

  handleFileUploaded = (data: Uint8Array) => {
    this.setState({
      file: data
    });
  }

  onChangeName = (name: string) => {
    this.setState({
      name: name
    });
  }

  onChangePassword = (password: string) => {
    this.setState({
      password: password
    });
  }

  onChangeSeed = (seed: string) => {
    this.setState({
      seed: seed
    });
  }

  toggleScreen = () => {
    const { screen } = this.state;
    this.setState({
      screen: screen === 'new' ? 'unlock' : 'new'
    });
  }

  restoreAccount = () => {
    const {
      history,
      onboardingStore
    } = this.props;

    onboardingStore!.setIsFirstRun(false);

    // FIXME: restoreAccount account with light-api

    history.push('/Identity');
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
          { screen === 'new' ? this.renderNewAccountScreen() : this.renderUnlockScreen() }
        </Container>
      </Modal>
    );
  }

  renderNewAccountScreen () {
    const { address, name, password, seed } = this.state;

    return (
      <React.Fragment>
        <Modal.Header> Create New Account </Modal.Header>
        <Modal.Content>
          <Stacked>
            <AddressSummary address={address} name={name} />
            <Modal.SubHeader> Name the account </Modal.SubHeader>
            <Input
              autoFocus
              onChange={this.onChangeName}
              value={name}
            />
            <Modal.SubHeader> Create from the following mnemonic seed </Modal.SubHeader>
            <Segment> <FadedText> {seed} </FadedText> </Segment>
            <Modal.SubHeader> Encrypt it with a passphrase </Modal.SubHeader>
            <Input
              autoFocus
              onChange={this.onChangePassword}
              value={password}
              type={'password'}
            />
            <Modal.Actions>
              <Stacked>
                <NavButton onClick={this.restoreAccount}> Save </NavButton>
                <Modal.FadedText>or</Modal.FadedText>
                <NavLink onClick={this.toggleScreen}> Unlock an existing account </NavLink>
              </Stacked>
            </Modal.Actions>
          </Stacked>
        </Modal.Content>
      </React.Fragment>
    );
  }

  renderUnlockScreen () {
    return (
      <React.Fragment>
        <Modal.Header> Unlock Account </Modal.Header>
        <Modal.Content>
          <Stacked>
            {this.renderJSONCard()}
            <Modal.FadedText> or </Modal.FadedText>
            {this.renderPhraseCard()}
            {this.renderActions()}
          </Stacked>
        </Modal.Content>
      </React.Fragment>
    );
  }

  renderJSONCard () {
    return (
      <React.Fragment>
        <Modal.SubHeader> Restore Account from JSON Backup File </Modal.SubHeader>
        <InputFile onChange={this.handleFileUploaded}/>
      </React.Fragment>
    );
  }

  renderPhraseCard () {
    const { phrase } = this.state;

    return (
      <React.Fragment>
        <Modal.SubHeader> Import Account from Seed Phrase </Modal.SubHeader>
        <Input
          onChange={this.handleInputSeedPhrase}
          value={phrase} />
      </React.Fragment>
    );
  }

  renderActions () {
    return (
      <Modal.Actions>
        <Stacked>
          <NavButton onClick={this.restoreAccount}>Unlock</NavButton>
          <Modal.FadedText>or</Modal.FadedText>
          <NavLink onClick={this.toggleScreen}> Create New Account </NavLink>
        </Stacked>
      </Modal.Actions>
    );
  }
}
