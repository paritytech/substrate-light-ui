// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import FileSaver from 'file-saver';
import { BlockNumber, Header } from '@polkadot/types';
import { AppContext } from '@substrate/ui-common';
import { Balance, Dropdown, FadedText, Icon, Input, Margin, Menu, Modal, NavLink, Stacked, StackedHorizontal, StyledLinkButton, WithSpaceAround, WithSpaceBetween } from '@substrate/ui-components';
import React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { Observable, Subscription } from 'rxjs';

import { InputAddress } from './IdentityHeader.styles';

interface Props extends RouteComponentProps { }

type State = {
  blockNumber?: BlockNumber,
  renameModalOpen: boolean,
  backupModalOpen: boolean,
  forgetModalOpen: boolean,
  name: string,
  newName: string,
  error?: string,
  success?: string,
  password: string
};

export class IdentityHeader extends React.PureComponent<Props, State> {
  static contextType = AppContext;

  context!: React.ContextType<typeof AppContext>; // http://bit.ly/typescript-and-react-context

  state: State = {
    backupModalOpen: false,
    forgetModalOpen: false,
    renameModalOpen: false,
    name: '',
    newName: '',
    password: ''
  };

  chainHeadSub?: Subscription;

  componentDidMount () {
    const { keyring } = this.context;

    this.subscribeChainHead();

    const address = this.getAddress();
    const name = keyring.getPair(address).getMeta().name;

    this.setState({
      name,
      newName: name
    });
  }

  componentDidUpdate (prevProps: Props) {
    if (prevProps.location.pathname.split('/')[2]
      !== this.props.location.pathname.split('/')[2]) {
      this.closeAllSubscriptions();
      this.subscribeChainHead();
    }
  }

  componentWillUnmount () {
    this.closeAllSubscriptions();
  }

  closeAllSubscriptions () {
    if (this.chainHeadSub) {
      this.chainHeadSub.unsubscribe();
      this.chainHeadSub = undefined;
    }
  }

  renameCurrentAccount = () => {
    const { keyring } = this.context;
    const { newName } = this.state;
    const address = this.getAddress();

    keyring.saveAccountMeta(keyring.getPair(address), { name: newName });

    this.setState({ name: newName }, () => {
      this.closeRenameModal();
      this.onSuccess('Successfully renamed account!');
    });
  }

  backupCurrentAccount = () => {
    const { keyring } = this.context;
    const { password } = this.state;
    const address = this.getAddress();

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

  forgetCurrentAccount = () => {
    const { keyring } = this.context;
    const { history } = this.props;
    const address = this.getAddress();

    try {
      // forget it from keyring
      keyring.forgetAccount(address);

      this.closeForgetModal();

      history.push('/identity');
    } catch (e) {
      this.onError(e.message);
    }
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

  closeRenameModal = () => {
    this.setState({
      renameModalOpen: false,
      newName: this.state.name
    });
  }

  getAddress = () => {
    return this.props.location.pathname.split('/')[2];
  }

  getName = () => {
    const { keyring } = this.context;
    const address = this.getAddress();

    return address && keyring.getAccount(address).getMeta().name;
  }

  handleChangeCurrentAccount = (account: string) => {
    const { history } = this.props;

    history.push(`/transfer/${account}`);
  }

  onChangeName = ({ target: { value } }: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newName: value });
  }

  onChangePassword = ({ target: { value } }: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ password: value });
  }

  onError = (value: string) => {
    const { alertStore } = this.context;

    alertStore.enqueue({
      content: value,
      type: 'error'
    });
  }

  onSuccess = (value: string) => {
    const { alertStore } = this.context;

    alertStore.enqueue({
      content: value,
      type: 'success'
    });
  }

  openRenameModal = () => {
    this.setState({ renameModalOpen: true });
  }

  openBackupModal = () => {
    this.setState({ backupModalOpen: true });
  }

  openForgetModal = () => {
    this.setState({ forgetModalOpen: true });
  }

  /* Note: this violates the "order functions alphabetically" rule of thumb, but makes it more readable
     to have it all in the same place. Also, it is down here as openBackupModal and openForgetModal need
     to be initialized first else tsc will complain.
   */
  renameTrigger = <Dropdown.Item icon='edit' onClick={this.openRenameModal} text='Rename Account' />;
  backupTrigger = <Dropdown.Item icon='arrow alternate circle down' onClick={this.openBackupModal} text='Backup Account' />;
  forgetTrigger = <Dropdown.Item icon='trash' onClick={this.openForgetModal} text='Forget Account' />;

  subscribeChainHead = () => {
    const { api } = this.context;

    this.chainHeadSub = (api.rpc.chain.subscribeNewHead() as Observable<Header>)
      .subscribe((header) => this.setState({ blockNumber: header.blockNumber }));
  }

  render () {
    const address = this.getAddress();

    return (
      <Menu>
        <Menu.Item>
          <InputAddress
            label={null}
            onChange={this.handleChangeCurrentAccount}
            type='account'
            value={address}
            withLabel={false}
          />
          <Margin left='medium' />
          <NavLink to='/accounts/add'>
            <Icon name='plus' />
          </NavLink>
        </Menu.Item>
        <Menu.Item>
          <Balance address={address} fontSize='medium' />
        </Menu.Item>
        <Dropdown
          icon='setting'
          item
          pointing
          text='Manage Account &nbsp;' /* TODO add margin to the icon instead */
        >
          <Dropdown.Menu>
            {this.renderRenameModal()}
            {this.renderBackupConfirmationModal()}
            {this.renderForgetConfirmationModal()}
          </Dropdown.Menu>
        </Dropdown>
        <Menu.Item>
          <NavLink to='/addresses'> Manage Addresses </NavLink>
          <Icon name='address book' />
        </Menu.Item>
      </Menu>
    );
  }

  renderRenameModal () {
    const { renameModalOpen, newName } = this.state;

    return (
      <Modal closeOnDimmerClick closeOnEscape open={renameModalOpen} trigger={this.renameTrigger}>
        <WithSpaceAround>
          <Stacked>
            <Modal.SubHeader>Rename account</Modal.SubHeader>
            <FadedText>Please enter the new name of the account.</FadedText>
            <Modal.Actions>
              <Stacked>
                <FadedText>Account name</FadedText>
                <Input onChange={this.onChangeName} type='text' value={newName} />
                <StackedHorizontal>
                  <WithSpaceBetween>
                    <StyledLinkButton onClick={this.closeRenameModal}><Icon name='remove' color='red' /> <FadedText>Cancel</FadedText></StyledLinkButton>
                    <StyledLinkButton onClick={this.renameCurrentAccount}><Icon name='checkmark' color='green' /> <FadedText>Rename</FadedText></StyledLinkButton>
                  </WithSpaceBetween>
                </StackedHorizontal>
              </Stacked>
            </Modal.Actions>
          </Stacked>
        </WithSpaceAround>
      </Modal>
    );
  }

  renderBackupConfirmationModal () {
    const { backupModalOpen, password } = this.state;

    return (
      <Modal closeOnDimmerClick closeOnEscape open={backupModalOpen} trigger={this.backupTrigger}>
        <WithSpaceAround>
          <Stacked>
            <Modal.SubHeader> Please Confirm You Want to Backup this Account </Modal.SubHeader>
            <FadedText>By pressing confirm you will be downloading a JSON keyfile that can later be used to unlock your account. </FadedText>
            <Modal.Actions>
              <Stacked>
                <FadedText> Please encrypt your account first with the account's password. </FadedText>
                <Input onChange={this.onChangePassword} type='password' value={password} />
                <StackedHorizontal>
                  <WithSpaceBetween>
                    <StyledLinkButton onClick={this.closeBackupModal}><Icon name='remove' color='red' /> <FadedText>Cancel</FadedText></StyledLinkButton>
                    <StyledLinkButton onClick={this.backupCurrentAccount}><Icon name='checkmark' color='green' /> <FadedText>Confirm Backup</FadedText></StyledLinkButton>
                  </WithSpaceBetween>
                </StackedHorizontal>
              </Stacked>
            </Modal.Actions>
          </Stacked>
        </WithSpaceAround>
      </Modal>
    );
  }

  renderForgetConfirmationModal () {
    const { forgetModalOpen } = this.state;

    return (
      <Modal closeOnDimmerClick={true} closeOnEscape={true} open={forgetModalOpen} trigger={this.forgetTrigger}>
        <WithSpaceAround>
          <Stacked>
            <Modal.SubHeader> Please Confirm You Want to Forget this Account </Modal.SubHeader>
            <b>By pressing confirm, you will be removing this account from your Saved Accounts. </b>
            <Margin top />
            <FadedText> You can restore this later from your mnemonic phrase or json backup file. </FadedText>
            <Modal.Actions>
              <StackedHorizontal>
                <StyledLinkButton onClick={this.closeForgetModal}><Icon name='remove' color='red' /> <FadedText> Cancel </FadedText> </StyledLinkButton>
                <StyledLinkButton onClick={this.forgetCurrentAccount}><Icon name='checkmark' color='green' /> <FadedText> Confirm Forget </FadedText> </StyledLinkButton>
              </StackedHorizontal>
            </Modal.Actions>
          </Stacked>
        </WithSpaceAround>
      </Modal>
    );
  }
}
