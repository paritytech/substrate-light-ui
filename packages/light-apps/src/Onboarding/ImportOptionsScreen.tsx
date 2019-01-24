// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import { inject, observer } from 'mobx-react';
import { u8aToString } from '@polkadot/util';
import { RouteComponentProps } from 'react-router-dom';
import { Input, InputFile, Modal, NavButton, NavLink, Stacked } from '@polkadot/ui-components';
import { OnboardingScreenType } from './Onboarding';
import { AccountStore } from '../stores/accountStore';

interface Props extends RouteComponentProps {
  accountStore: AccountStore;
  toggleScreen: (to: OnboardingScreenType) => void;
  onChangePhrase: () => void;
}

type State = {
  address?: string,
  error: string | null,
  jsonString: string | null,
  name?: string,
  recoveryPhrase: string | null
};

@inject('accountStore')
@observer
export class ImportOptionsScreen extends React.PureComponent<Props, State> {
  state: State = {
    error: null,
    jsonString: null,
    recoveryPhrase: null
  };

  handleFileUploaded = async (file: Uint8Array) => {
    const { accountStore, toggleScreen } = this.props;

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

      toggleScreen('save');
    } catch (e) {
      console.error(e);
      this.setState({ error: e.message });
      alert('Please resolve this before you continue: ' + e.message);
    }
  }

  unlockWithPhrase = () => {
    const { toggleScreen } = this.props;
    const { recoveryPhrase } = this.state;

    if (recoveryPhrase && recoveryPhrase.split(' ').length === 12) {
      this.setState({
        error: null
      });

      toggleScreen('save');
    } else {
      this.setState({
        error: 'The entered Recovery Phrase is not valid.'
      });
    }
  }

  render () {
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

  renderJSONCard () {
    return (
      <React.Fragment>
        <Modal.SubHeader> Restore Account from JSON Backup File </Modal.SubHeader>
        <InputFile onChange={this.handleFileUploaded} />
      </React.Fragment>
    );
  }

  renderPhraseCard () {
    const { onChangePhrase, recoveryPhrase } = this.props;

    return (
      <React.Fragment>
        <Modal.SubHeader> Import Account from Mnemonic Recovery Phrase </Modal.SubHeader>
        <Input
        onChange={onChangePhrase}
        type='text'
        value={recoveryPhrase} />
      </React.Fragment>
    );
  }

  renderImportActions () {
    const { toggleScreen } = this.props;

    return (
      <Modal.Actions>
        <Stacked>
          <NavButton onClick={this.unlockWithPhrase}>Unlock</NavButton>
          <Modal.FadedText>or</Modal.FadedText>
          <NavLink onClick={() => toggleScreen('new')}> Create New Account </NavLink>
        </Stacked>
      </Modal.Actions>
    );
  }
}
