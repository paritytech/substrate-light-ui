// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import { Address, AddressSummary, ErrorText, Icon, Input, Modal, NavButton, Stacked, StackedHorizontal, StyledLinkButton, SuccessText, WithSpaceBetween } from '@polkadot/ui-components';
import keyring from '@polkadot/ui-keyring';
import { stringUpperFirst } from '@polkadot/util';

import BN from 'bn.js';
import FileSaver from 'file-saver';
import React from 'react';
import { RouteComponentProps } from 'react-router-dom';

import { StyledCard, CardHeader, CardContent } from './IdentityCard.styles';

interface Props extends RouteComponentProps {}

type State = {
  address: string,
  backupModalOpen: boolean,
  buttonText: string
  error: string | null,
  forgetModalOpen: boolean,
  name?: string,
  password: string,
  success: string | null
};

const PLACEHOLDER_ADDRESS = '5'.padEnd(16, 'x');
// FIXME: balance should come from LightAPI HOC's observables
export class IdentityCard extends React.Component<Props, State> {
  state: State = {
    address: PLACEHOLDER_ADDRESS,
    backupModalOpen: false,
    buttonText: 'Transfer',
    error: null,
    forgetModalOpen: false,
    password: '',
    success: null
  };

  componentDidMount () {
    const { location } = this.props;

    const pairs = keyring.getPairs();

    let address = '';
    let name = '';

    try {
      address = location.pathname.split('/')[2];
      name = keyring.getPair(address).getMeta().name;
    } catch (e) {
      console.warn(e);
      const defaultAccount = pairs[0];
      const defaultAddress = defaultAccount.address();
      address = defaultAddress;
      name = defaultAccount.getMeta().name;
    }

    this.setState({
      address,
      name
    });
  }

  closeBackupModal = () => {
    this.setState({
      backupModalOpen: false,
      password: ''
    });
  }

  closeForgetModal = () => {
    this.setState({ forgetModalOpen: false });
  }

  openBackupModal = () => {
    this.setState({ backupModalOpen: true });
  }

  openForgetModal = () => {
    this.setState({ forgetModalOpen: true });
  }

  // Note: this violates the "order functions alphabetically" rule of thumb, but makes it more readable
  // to have it all in the same place.
  backupTrigger = <StyledLinkButton onClick={this.openBackupModal}>Backup</StyledLinkButton>;
  forgetTrigger = <StyledLinkButton onClick={this.openForgetModal}>Forget</StyledLinkButton>;

  private backupCurrentAccount = () => {
    const { address, password } = this.state;

    try {
      const pair = keyring.getPair(address);
      const json = keyring.backupAccount(pair, password);
      const blob = new Blob([JSON.stringify(json)], { type: 'application/json; charset=utf-8' });

      FileSaver.saveAs(blob, `${address}.json`);

      this.closeBackupModal();
      this.onSuccess('Successfully backed up account to json keyfile!');
    } catch (e) {
      this.closeBackupModal();
      this.onError(e.message);
    }
  }

  private forgetCurrentAccount = () => {
    const { address } = this.state;
    const { history } = this.props;

    try {
      // forget it from keyring
      keyring.forgetAccount(address);

      // redirect to the next keyring pair
      const nextPair = keyring.getPairs()[0];
      const nextAddress = nextPair.address();
      const nextName = nextPair.getMeta().name;

      const nextState = {
        address: nextAddress,
        forgetModalOpen: false,
        name: nextName
      };

      const nextLocation = {
        pathname: `/identity/${nextAddress}`,
        state: nextState
      };

      this.setState(nextState);

      this.onSuccess('Successfully forgot account from keyring');

      history.push(nextLocation);
    } catch (e) {
      this.onError(e.message);
    }
  }

  private handleToggleApp = () => {
    const { address } = this.state;
    const { location, history } = this.props;

    const to = location.pathname.split('/')[1].toLowerCase() === 'identity' ? 'transfer' : 'identity';
    const buttonText = stringUpperFirst(to);

    history.push(`/${to}/${address}`);

    this.setState({ buttonText });
  }

  private onChangePassword = ({ target: { value } }: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ password: value });
  }

  private onError = (value: string | null) => {
    this.setState({ error: value, success: null });
  }

  private onSuccess = (value: string | null) => {
    this.setState({ error: null, success: value });
  }

  render () {
    const { address, buttonText, name } = this.state;

    return (
      <StyledCard>
        <CardHeader>Current Account</CardHeader>
        <CardContent>
          <AddressSummary address={address} balance={new BN(10000)} name={name} />
          <Stacked>
            <Address address={address} />
            <StackedHorizontal>
              {this.renderForgetConfirmationModal()}
              or
              {this.renderBackupConfirmationModal()}
            </StackedHorizontal>
          </Stacked>
          <NavButton value={buttonText} onClick={this.handleToggleApp} />
        </CardContent>
        {this.renderError()}
        {this.renderSuccess()}
      </StyledCard>
    );
  }

  renderBackupConfirmationModal () {
    const { backupModalOpen, password } = this.state;

    return (
      <Modal trigger={this.backupTrigger} open={backupModalOpen} basic>
        <Modal.Header> Please Confirm You Want to Backup this Account </Modal.Header>
        <h2>By pressing confirm you will be downloading a JSON keyfile that can later be used to unlock your account. </h2>
        <Modal.Actions>
            <Stacked>
              <Modal.SubHeader> Please encrypt your account first with the account's password. </Modal.SubHeader>
              <Input min={8} onChange={this.onChangePassword} type='password' value={password} />
              <StackedHorizontal>
                <WithSpaceBetween>
                  <Icon name='remove' color='red' /> <StyledLinkButton color='white' onClick={this.closeBackupModal}>No</StyledLinkButton>
                  <Icon name='checkmark' color='green' /> <StyledLinkButton color='white' onClick={this.backupCurrentAccount}>Confirm Backup</StyledLinkButton>
                </WithSpaceBetween>
              </StackedHorizontal>
            </Stacked>
        </Modal.Actions>
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

  renderForgetConfirmationModal () {
    const { forgetModalOpen } = this.state;

    return (
      <Modal trigger={this.forgetTrigger} open={forgetModalOpen} basic>
        <Modal.Header> Please Confirm You Want to Forget this Account </Modal.Header>
        <h2>Please confirm that you want to remove this account from your keyring. </h2>
        <Modal.Actions>
            <Icon name='remove' color='red' /> <StyledLinkButton color='white' onClick={this.closeForgetModal}>No</StyledLinkButton>
            <Icon name='checkmark' color='green' /> <StyledLinkButton color='white' onClick={this.forgetCurrentAccount}>Confirm Forget</StyledLinkButton>
        </Modal.Actions>
      </Modal>
    );
  }

  renderSuccess () {
    const { success } = this.state;

    return (
      <SuccessText>
        {success || null}
      </SuccessText>
    );
  }
}
