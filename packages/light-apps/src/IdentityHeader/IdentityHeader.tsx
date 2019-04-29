// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import FileSaver from 'file-saver';
import { AppContext, AlertsContext } from '@substrate/ui-common';
import uiSettings from '@polkadot/ui-settings';
import { Balance, CopyButton, Dropdown, DropdownProps, FadedText, Icon, Input, Margin, Menu, Modal, NavLink, Stacked, StackedHorizontal, StyledLinkButton, WithSpaceAround, WithSpaceBetween, SubHeader } from '@substrate/ui-components';
import React, { useContext, useState } from 'react';
import { Route, RouteComponentProps, Switch } from 'react-router-dom';

import { InputAddress } from './IdentityHeader.styles';

const KEY_PREFIX = '__dropdown_option_';

interface MatchParams {
  currentAccount: string;
}

interface Props extends RouteComponentProps<MatchParams> { }

const nodeOptions: Array<any> = [];

uiSettings.availableNodes.forEach(availNode => {
  nodeOptions.push({
    key: `${KEY_PREFIX}${nodeOptions.length}`,
    value: availNode.value,
    text: availNode.text
  });
});

export function IdentityHeader (props: Props) {
  const { history } = props;
  const { keyring, setUrl } = useContext(AppContext);
  const { enqueue } = useContext(AlertsContext);

  const address = props.location.pathname.split('/')[2];
  const [name, setName] = useState(address && keyring.getPair(address).getMeta().name);
  const [settings, setSettings] = useState(uiSettings.get());

  // Alert helpers
  const notifyError = (value: any) => {
    enqueue({
      content: value,
      type: 'success'
    });
  };
  const notifySuccess = (value: any) => {
    enqueue({
      content: value,
      type: 'error'
    });
  };

  // Change account
  const changeCurrentAccount = (account: string) => {
    history.push(`/transfer/${account}`);
  };

  // Rename modal
  const [renameModalOpen, setRenameModalOpen] = useState(false);
  const openRenameModal = () => setRenameModalOpen(true);
  const closeRenameModal = () => { setRenameModalOpen(false); setInputName(name); };
  const [inputName, setInputName] = useState(name);
  const onChangeInputName = ({ target: { value } }: React.ChangeEvent<HTMLInputElement>) =>
    setInputName(value);
  const renderRenameModal = () => {
    return (
      <Modal closeOnDimmerClick closeOnEscape open={renameModalOpen} trigger={<Dropdown.Item icon='edit' onClick={openRenameModal} text='Rename Account'/>}>
        <WithSpaceAround>
          <Stacked>
            <Modal.SubHeader>Rename account</Modal.SubHeader>
            <FadedText>Please enter the new name of the account.</FadedText>
            <Modal.Actions>
              <Stacked>
                <FadedText>Account name</FadedText>
                <Input onChange={onChangeInputName} type='text' value={inputName} />
                <StackedHorizontal>
                  <WithSpaceBetween>
                    <StyledLinkButton onClick={closeRenameModal}><Icon name='remove' color='red' /> <FadedText>Cancel</FadedText></StyledLinkButton>
                    <StyledLinkButton onClick={renameCurrentAccount}><Icon name='checkmark' color='green' /> <FadedText>Rename</FadedText></StyledLinkButton>
                  </WithSpaceBetween>
                </StackedHorizontal>
              </Stacked>
            </Modal.Actions>
          </Stacked>
        </WithSpaceAround>
      </Modal>
    );
  };
  const renameCurrentAccount = () => {
    keyring.saveAccountMeta(keyring.getPair(address), { name: inputName });

    setName(inputName);
    closeRenameModal();
    notifySuccess('Successfully renamed account!');
  };

  // Backup modal
  const [backupModalOpen, setBackupModalOpen] = useState(false);
  const openBackupModal = () => setBackupModalOpen(true);
  const closeBackupModal = () => { setBackupModalOpen(false); setInputPassword(''); };
  const [inputPassword, setInputPassword] = useState('');
  const onChangeInputPassword = ({ target: { value } }: React.ChangeEvent<HTMLInputElement>) =>
    setInputPassword(value);
  const renderBackupConfirmationModal = () => {
    return (
      <Modal closeOnDimmerClick closeOnEscape open={backupModalOpen} trigger={<Dropdown.Item icon='arrow alternate circle down' onClick={openBackupModal} text='Backup Account' />}>
        <WithSpaceAround>
          <Modal.SubHeader> Please Confirm You Want to Backup this Account </Modal.SubHeader>
          <FadedText>By pressing confirm you will be downloading a JSON keyfile that can later be used to unlock your account. </FadedText>
          <Modal.Actions>
            <Stacked>
              <FadedText> Please encrypt your account first with the account's password. </FadedText>
              <Input onChange={onChangeInputPassword} type='password' value={inputPassword} />
              <StackedHorizontal>
                <WithSpaceBetween>
                  <StyledLinkButton onClick={closeBackupModal}><Icon name='remove' color='red' /> <FadedText>Cancel</FadedText></StyledLinkButton>
                  <StyledLinkButton onClick={backupCurrentAccount}><Icon name='checkmark' color='green' /> <FadedText>Confirm Backup</FadedText></StyledLinkButton>
                </WithSpaceBetween>
              </StackedHorizontal>
            </Stacked>
          </Modal.Actions>
        </WithSpaceAround>
      </Modal>
    );
  };
  const backupCurrentAccount = () => {
    try {
      const pair = keyring.getPair(address);
      const json = keyring.backupAccount(pair, inputPassword);
      const blob = new Blob([JSON.stringify(json)], { type: 'application/json; charset=utf-8' });

      FileSaver.saveAs(blob, `${address}.json`);

      closeBackupModal();
      notifySuccess('Successfully backed up account to json keyfile!');
    } catch (e) {
      closeBackupModal();
      notifyError(e.message);
    }
  };

  // Forget modal
  const [forgetModalOpen, setForgetModalOpen] = useState(false);
  const openForgetModal = () => setForgetModalOpen(true);
  const closeForgetModal = () => setForgetModalOpen(false);
  const renderForgetConfirmationModal = () => {
    return (
      <Modal closeOnDimmerClick={true} closeOnEscape={true} open={forgetModalOpen} trigger={<Dropdown.Item icon='trash' onClick={openForgetModal} text='Forget Account'/>}>
        <WithSpaceAround>
          <Stacked>
            <Modal.SubHeader> Please Confirm You Want to Forget this Account </Modal.SubHeader>
            <b>By pressing confirm, you will be removing this account from your Saved Accounts. </b>
            <Margin top />
            <FadedText> You can restore this later from your mnemonic phrase or json backup file. </FadedText>
            <Modal.Actions>
              <StackedHorizontal>
                <StyledLinkButton onClick={closeForgetModal}><Icon name='remove' color='red' /> <FadedText> Cancel </FadedText> </StyledLinkButton>
                <StyledLinkButton onClick={forgetCurrentAccount}><Icon name='checkmark' color='green' /> <FadedText> Confirm Forget </FadedText> </StyledLinkButton>
              </StackedHorizontal>
            </Modal.Actions>
          </Stacked>
        </WithSpaceAround>
      </Modal>
    );
  };
  const forgetCurrentAccount = () => {
    try {
      // forget it from keyring
      keyring.forgetAccount(address);

      closeForgetModal();

      history.push('/transfer');
    } catch (e) {
      notifyError(e.message);
    }
  };

  const renderPrimaryMenu = () => {
    return (
      <Menu stackable>
        <Switch>
          <Route path={['/settings', '/transfer']}>
            <Menu.Item fitted>
              <StackedHorizontal>
                <InputAddress
                  label={null}
                  onChange={changeCurrentAccount}
                  type='account'
                  value={address}
                  withLabel={false}
                />
                <CopyButton value={address} />
              </StackedHorizontal>
            </Menu.Item>
            <Menu.Item><Balance address={address} fontSize='medium' /></Menu.Item>
            <Menu.Item>
              <NavLink to={`/accounts/${address}/add`}>
                Add an Account <Icon name='plus' />
              </NavLink>
            </Menu.Item>
            <Menu.Menu position='right'>
              <Dropdown
                icon='setting'
                position='right'
                item
                pointing
                text='Manage Account &nbsp;' /* TODO add margin to the icon instead */
              >
                <Dropdown.Menu>
                  {renderRenameModal()}
                  {renderBackupConfirmationModal()}
                  {renderForgetConfirmationModal()}
                </Dropdown.Menu>
              </Dropdown>
            </Menu.Menu>
          </Route>
          <Route path='/addresses'>
            <Menu.Item><FadedText>Manage Address Book</FadedText></Menu.Item>
            <Menu.Item><SubHeader>Inspect the status of any identity and name it for later use</SubHeader></Menu.Item>
          </Route>
          <Route path='/accounts'>
            <Menu.Item><FadedText>Add Account</FadedText></Menu.Item>
            <Menu.Item><SubHeader>Create a new account from a generated mnemonic seed, or import via your JSON backup file/mnemonic phrase. </SubHeader></Menu.Item>
          </Route>
        </Switch>
      </Menu>
    );
  };

  const isValidUrl = (apiUrl: string): boolean => {
    return (
      (apiUrl.length > 5) &&
      // check that it starts with a valid ws identifier
      (apiUrl.startsWith('ws://') || apiUrl.startsWith('wss://'))
    );
  };

  const onSelectNode = (event: React.SyntheticEvent<HTMLElement, Event>, data: DropdownProps) => {
    const url = data.value! as string;
    if (isValidUrl(url)) {
      setSettings({ ...uiSettings, apiUrl: url });
      uiSettings.set(settings);
      setUrl(url);
    } else {
      enqueue({
        content: 'The Websocket endpoint you selected is invalid.',
        type: 'error'
      });
    }
  };

  const renderSecondaryMenu = () => {
    const navToManageAddressBook = () => {
      history.push(`/addresses/${address}`);
    };

    const navToTransfer = () => {
      history.push(`/transfer/${address}`);
    };

    return (
      <StackedHorizontal justifyContent='start' alignItems='flex-start'>
        <Menu stackable secondary>
          <Menu.Item onClick={navToTransfer}>
            Transfer Balance
            <Margin left='small' />
            <Icon color='black' name='arrow right' />
          </Menu.Item>
          <Menu.Item onClick={navToManageAddressBook}>
            Manage Address Book
            <Margin left='small' />
            <Icon color='black' name='address book' />
          </Menu.Item>
          <Dropdown icon='setting' item onChange={onSelectNode} options={nodeOptions} position='right' pointing selection text='Select a Node' />
        </Menu>
      </StackedHorizontal>
    );
  };

  const renderHeader = () => (
    <React.Fragment>
      <Margin top='big' />
      {renderSecondaryMenu()}
      {renderPrimaryMenu()}
    </React.Fragment>
  );

  return renderHeader();
}
