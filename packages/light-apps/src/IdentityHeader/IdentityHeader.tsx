// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import FileSaver from 'file-saver';
import { AppContext, AlertsContext } from '@substrate/ui-common';
import { Balance, Dropdown, FadedText, Icon, Input, Margin, Menu, Modal, NavLink, Stacked, StackedHorizontal, StyledLinkButton, WithSpaceAround, WithSpaceBetween } from '@substrate/ui-components';
import React, { useContext, useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';

import { InputAddress } from './IdentityHeader.styles';

interface Props extends RouteComponentProps { }

export function IdentityHeader (props: Props) {
  const { history } = props;
  const { keyring } = useContext(AppContext);
  const { enqueue } = useContext(AlertsContext);

  const address = props.location.pathname.split('/')[2];
  const [name, setName] = useState(address && keyring.getPair(address).getMeta().name);

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

      history.push('/identity');
    } catch (e) {
      notifyError(e.message);
    }
  };

  return (
    <Menu>
      <Menu.Item>
        <InputAddress
          label={null}
          onChange={changeCurrentAccount}
          type='account'
          value={address}
          withLabel={false}
        />
        <Margin left='medium' />
        <NavLink to='/accounts/add'>
          Add new account
          </NavLink>
      </Menu.Item>
      <Menu.Item>
        <Balance address={address} fontSize='medium' />
      </Menu.Item>
      <Dropdown
        icon='setting'
        item
        text='Manage account &nbsp;' /* TODO add margin to the icon instead */
      >
        <Dropdown.Menu>
          <Modal closeOnDimmerClick closeOnEscape open={renameModalOpen} trigger={<Dropdown.Item icon='edit' onClick={openRenameModal} text='Rename Account' />}>
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
          <Modal closeOnDimmerClick closeOnEscape open={backupModalOpen} trigger={<Dropdown.Item icon='arrow alternate circle down' onClick={openBackupModal} text='Backup Account' />}>
            <WithSpaceAround>
              <Stacked>
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
              </Stacked>
            </WithSpaceAround>
          </Modal>
          <Modal closeOnDimmerClick={true} closeOnEscape={true} open={forgetModalOpen} trigger={<Dropdown.Item icon='trash' onClick={openForgetModal} text='Forget Account' />}>
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
        </Dropdown.Menu>
      </Dropdown>
    </Menu>
  );
}
