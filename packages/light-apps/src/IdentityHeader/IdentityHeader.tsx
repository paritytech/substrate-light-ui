// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import FileSaver from 'file-saver';
import { AppContext } from '@substrate/ui-common';
import { Balance, CopyButton, Dropdown, FadedText, Icon, Margin, Menu, NavLink, StackedHorizontal, SubHeader } from '@substrate/ui-components';
import React, { useContext, useState } from 'react';
import { Route, RouteComponentProps, Switch } from 'react-router-dom';

import { InputAddress } from './IdentityHeader.styles';
import { notifyError, notifySuccess } from './alerts';
import { renderBackupConfirmationModal, renderForgetConfirmationModal, renderRenameModal } from './components';

interface MatchParams {
  currentAccount: string;
}

interface Props extends RouteComponentProps<MatchParams> { }

export function IdentityHeader (props: Props) {
  const { history } = props;
  const { keyring } = useContext(AppContext);

  const address = props.location.pathname.split('/')[2];
  const [name, setName] = useState(address && keyring.getPair(address).getMeta().name);

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
          <Route path={['/transfer']}>
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
            <Menu.Menu fitted position='right'>
              <Dropdown
                icon='setting'
                position='right'
                item
                pointing
                text='Manage Account &nbsp;' /* TODO add margin to the icon instead */
              >
                <Dropdown.Menu>
                  {renderRenameModal(closeRenameModal, inputName, onChangeInputName, openRenameModal, renameCurrentAccount, renameModalOpen)}
                  {renderBackupConfirmationModal(backupCurrentAccount, backupModalOpen, closeBackupModal, inputPassword, onChangeInputPassword, openBackupModal)}
                  {renderForgetConfirmationModal(closeForgetModal, forgetCurrentAccount, forgetModalOpen, openForgetModal)}
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
