// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import BN from 'bn.js';

import keyring from '@polkadot/ui-keyring';
import { Address, AddressSummary, ErrorText, Icon, Modal, NavButton, Stacked, StackedHorizontal, StyledLinkButton } from '@polkadot/ui-components';

import { RouteComponentProps } from 'react-router-dom';

import { StyledCard, CardHeader, CardContent } from './IdentityCard.styles';
import { camelizeInclusiveFirst } from '../utils/camelize';

interface Props extends RouteComponentProps {}

type State = {
  address: string,
  buttonText: string
  error: string | null,
  name?: string,
  backupModalOpen: boolean,
  forgetModalOpen: boolean
};

const PLACEHOLDER_ADDRESS = '5'.padEnd(16, 'x');
// FIXME: balance should come from LightAPI HOC's observables
export class IdentityCard extends React.Component<Props, State> {
  state: State = {
    address: PLACEHOLDER_ADDRESS,
    buttonText: 'Transfer',
    error: null,
    backupModalOpen: false,
    forgetModalOpen: false
  };

  componentDidMount () {
    const { location } = this.props;

    const pairs = keyring.getPairs();
    const defaultAccount = pairs[0];
    const defaultAddress = defaultAccount.address();

    const address = location.pathname.split('/')[2] || defaultAddress;
    const name = keyring.getPair(address).getMeta().name || defaultAccount.getMeta().name;

    this.setState({
      address,
      name
    });
  }

  private backupCurrentAccount = () => {
    const { address } = this.state;

    try {
      const pair = keyring.getPair(address);
      keyring.backupAccount(pair, 'password');
    } catch (e) {
      this.onError(e.message);
    }
  }

  private forgetCurrentAccount = () => {
    const { address } = this.state;
    const { history } = this.props;

    try {
      // forget it from keyring
      keyring.forgetAddress(address);

      // close the modal
      this.setState({
        forgetModalOpen: false
      });

      // redirect to the next keyring pair
      const pairs = keyring.getPairs();

      console.log(pairs);

      const nextAddress = pairs[0].address();

      console.log(nextAddress);

      debugger;

      history.push(`/identity/${nextAddress}`);

      this.forceUpdate();
    } catch (e) {
      this.onError(e.message);
    }
  }

  private handleToggleApp = () => {
    const { address } = this.state;
    const { location, history } = this.props;

    const to = location.pathname.split('/')[1].toLowerCase() === 'identity' ? 'transfer' : 'identity';
    const buttonText = camelizeInclusiveFirst(to);

    history.push(`/${to}/${address}`);

    this.setState({ buttonText });
  }

  private onError = (value: string | null) => {
    this.setState({
      error: value
    });
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
      </StyledCard>
    );
  }

  closeBackupModal = () => {
    this.setState({ backupModalOpen: false });
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

  backupTrigger = <StyledLinkButton onClick={this.openBackupModal}>Backup</StyledLinkButton>;
  forgetTrigger = <StyledLinkButton onClick={this.openForgetModal}>Forget</StyledLinkButton>;

  renderBackupConfirmationModal () {
    const { backupModalOpen } = this.state;

    return (
      <Modal trigger={this.backupTrigger} open={backupModalOpen} basic>
        <Modal.Header> Please Confirm You Want to Backup this Account </Modal.Header>
        <Modal.Content>By pressing confirm you will be downloading a JSON keyfile that can later be used to unlock your account. </Modal.Content>
        <Modal.Actions>
            <Icon name='remove' /> <StyledLinkButton onClick={this.closeBackupModal}>No</StyledLinkButton>
            <Icon name='checkmark' /> <StyledLinkButton onClick={this.backupCurrentAccount}>Confirm Backup</StyledLinkButton>
        </Modal.Actions>
      </Modal>
    );
  }

  renderForgetConfirmationModal () {
    const { forgetModalOpen } = this.state;

    return (
      <Modal trigger={this.forgetTrigger} open={forgetModalOpen} basic>
        <Modal.Header> Please Confirm You Want to Forget this Account </Modal.Header>
        <Modal.Content>By pressing confirm you want to remove this account from your keyring. </Modal.Content>
        <Modal.Actions>
            <Icon name='remove' /> <StyledLinkButton onClick={this.closeForgetModal}>No</StyledLinkButton>
            <Icon name='checkmark' /> <StyledLinkButton onClick={this.forgetCurrentAccount}>Confirm Forget</StyledLinkButton>
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
}
