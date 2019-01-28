// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AddressSummary, FadedText, Input, Modal, NavButton, NavLink, Segment, Stacked } from '@polkadot/ui-components';

import { inject, observer } from 'mobx-react';
import React from 'react';
import { RouteComponentProps } from 'react-router-dom';

import { OnboardingScreenType } from './Onboarding';
import { AccountStore } from '../stores/accountStore';

interface Props extends RouteComponentProps {
  accountStore: AccountStore;
  toggleScreen: (to: OnboardingScreenType) => void;
  addAccountToWallet: () => void;
  mnemonic: string;
  onChangeName: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onChangePassword: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onError: (value: string | null) => void;
  address?: string;
  name?: string;
  password?: string;
}

@inject('accountStore')
@observer
export class CreateNewAccountScreen extends React.Component<Props> {
  async componentDidMount () {
    const {
      accountStore: { setIsImport }
    } = this.props;

    await setIsImport(false);
  }

  render () {
    const { address, name, mnemonic } = this.props;

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
    const { onChangeName, name } = this.props;

    return (
      <React.Fragment>
        <Modal.SubHeader> Give it a name </Modal.SubHeader>
        <Input
          autoFocus
          onChange={onChangeName}
          type='text'
          value={name}
        />
      </React.Fragment>
    );
  }

  renderSetPassword () {
    const { onChangePassword, password } = this.props;

    return (
      <React.Fragment>
        <Modal.SubHeader> Encrypt it with a passphrase </Modal.SubHeader>
        <Input
          onChange={onChangePassword}
          type='password'
          value={password}
        />
      </React.Fragment>
    );
  }

  renderNewAccountActions () {
    const { addAccountToWallet, toggleScreen } = this.props;
    return (
      <React.Fragment>
        <Modal.Actions>
          <Stacked>
            <NavButton onClick={addAccountToWallet}> Save </NavButton>
            <Modal.FadedText>or</Modal.FadedText>
            <NavLink onClick={() => toggleScreen('importOptions')}> Import an existing account </NavLink>
          </Stacked>
        </Modal.Actions>
      </React.Fragment>
    );
  }
}
