// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import { inject, observer } from 'mobx-react';
import { RouteComponentProps } from 'react-router-dom';
import { Input, InputFile, Modal, NavButton, NavLink, Stacked } from '@polkadot/ui-components';
import { OnboardingScreenType } from './Onboarding';
import { AccountStore } from '../stores/accountStore';

interface Props extends RouteComponentProps {
  accountStore: AccountStore;
  addAccountToWallet: () => void;
  address?: string;
  name?: string;
  onChangePhrase: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onError: (value: string | null) => void;
  onChangeFile: (file: Uint8Array) => void;
  recoveryPhrase?: string;
  toggleScreen: (to: OnboardingScreenType) => void;
}

@inject('accountStore')
@observer
export class ImportOptionsScreen extends React.Component<Props> {
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
    const { onChangeFile } = this.props;

    return (
      <React.Fragment>
        <Modal.SubHeader> Restore Account from JSON Backup File </Modal.SubHeader>
        <InputFile onChange={onChangeFile} />
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
    const { addAccountToWallet, toggleScreen } = this.props;

    return (
      <Modal.Actions>
        <Stacked>
          <NavButton onClick={addAccountToWallet}>Unlock</NavButton>
          <Modal.FadedText>or</Modal.FadedText>
          <NavLink onClick={() => toggleScreen('new')}> Create New Account </NavLink>
        </Stacked>
      </Modal.Actions>
    );
  }
}
