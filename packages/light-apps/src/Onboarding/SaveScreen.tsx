// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import { inject, observer } from 'mobx-react';
import { RouteComponentProps } from 'react-router-dom';
import { AddressSummary, Input, Modal, NavButton, NavLink, Stacked } from '@polkadot/ui-components';

import { OnboardingScreenType } from './Onboarding';
import { AccountStore } from '../stores/accountStore';

interface Props extends RouteComponentProps {
  accountStore: AccountStore;
  address?: string;
  addAccountToWallet: () => void;
  mnemonic: string;
  name?: string;
  onChangeName: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onChangePassword: (e: React.ChangeEvent<HTMLInputElement>) => void;
  password?: string;
  toggleScreen: (to: OnboardingScreenType) => void;
}

type State = {
  error: string | null
};

@inject('accountStore')
@observer
export class SaveScreen extends React.PureComponent<Props, State> {
  render () {
    const { address, name } = this.props;

    return (
      <React.Fragment>
        <Modal.Header> Unlock and Save </Modal.Header>
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
