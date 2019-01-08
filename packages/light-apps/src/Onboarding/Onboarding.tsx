// Copyright 2017-2018 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import { withRouter, RouteComponentProps } from 'react-router';
import { inject, observer } from 'mobx-react';
import keyring from '@polkadot/ui-keyring';
import { u8aToString } from '@polkadot/util';
import { mnemonicGenerate, mnemonicToSeed, naclKeypairFromSeed } from '@polkadot/util-crypto';
import { AddressSummary, Container, FadedText, Input, InputFile, Modal, NavButton, NavLink, Segment, Stacked } from '@polkadot/ui-components';

import { OnboardingStoreInterface } from '../stores/interfaces';

type Props = RouteComponentProps & {
  onboardingStore?: OnboardingStoreInterface
};

type OnboardingScreenType = 'importOptions' | 'save' | 'new' ;

type State = {
  address?: string,
  isBipBusy: boolean,
  name?: string,
  password?: string,
  phrase?: string,
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
    screen: 'importOptions'
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

  handleFileUploaded = (file: Uint8Array) => {
    const json = JSON.parse(u8aToString(file));
    // FIXME: try catch unlock with json in store

    this.setState({
      name: json.name,
      address: json.address,
      screen: 'save'
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
      screen: screen === 'new' || screen === 'save'
                ? 'importOptions'
                : 'new',
      password: ''
    });
  }

  unlockWithPhrase = () => {
    // const { phrase } = this.state;
    // FIXME: try catch unlock with phrase in store
    this.setState({
      screen: 'save'
    });
  }

  addAccountToWallet = (file?: Uint8Array) => {
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
          { screen === 'new'
              ? this.renderNewAccountScreen()
              : screen === 'importOptions'
                ? this.renderImportOptionsScreen()
                : this.renderSaveScreen()
          }
        </Container>
      </Modal>
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
    const { address, name, seed } = this.state;

    return (
      <React.Fragment>
        <Modal.Header> Create New Account </Modal.Header>
        <Modal.Content>
          <Stacked>
            <AddressSummary address={address} name={name} />
            {this.renderSetName()}
            <Modal.SubHeader> Create from the following mnemonic seed </Modal.SubHeader>
            <Segment> <FadedText> {seed} </FadedText> </Segment>
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
        <Modal.SubHeader> { screen === 'save' ? 'Decrypt your account with your passphrase' : 'Encrypt it with a passphrase' } </Modal.SubHeader>
        <Input
          onChange={this.onChangePassword}
          value={password}
          type={'password'}
        />
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
          value={phrase}
          withLabel={false} />
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
