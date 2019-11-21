// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { KeyringContext } from '@substrate/accounts-app';
import { AlertsContext, handler } from '@substrate/context';
import {
  Dropdown,
  FadedText,
  Icon,
  Input,
  Stacked,
  StackedHorizontal,
  StyledLinkButton,
  SubHeader,
  WithSpaceAround,
  WithSpaceBetween,
} from '@substrate/ui-components';
import FileSaver from 'file-saver';
import React, { useContext, useState } from 'react';
import Modal from 'semantic-ui-react/dist/commonjs/modules/Modal/Modal';

interface Props {
  currentAccount: string;
}

export function Backup(props: Props): React.ReactElement {
  const { currentAccount } = props;
  const { keyring } = useContext(KeyringContext);
  const { enqueue } = useContext(AlertsContext);

  const [modalOpen, setModalOpen] = useState(false);
  const [password, setPassword] = useState('');

  const closeBackupModal = (): void => {
    setModalOpen(false);
    setPassword('');
  };
  const backupCurrentAccount = (): void => {
    try {
      const pair = keyring.getPair(currentAccount);
      const json = keyring.backupAccount(pair, password);
      const blob = new Blob([JSON.stringify(json)], { type: 'application/json; charset=utf-8' });

      FileSaver.saveAs(blob, `${currentAccount}.json`);

      closeBackupModal();
      enqueue({ content: 'Successfully backed up account to json keyfile!', type: 'success' });
    } catch (err) {
      closeBackupModal();
      enqueue({ content: err.message, type: 'error' });
    }
  };

  return (
    <Modal
      closeOnDimmerClick
      closeOnEscape
      open={modalOpen}
      trigger={
        <Dropdown.Item
          icon='arrow alternate circle down'
          onClick={(): void => setModalOpen(true)}
          text='Backup Account'
        />
      }
    >
      <WithSpaceAround>
        <SubHeader> Please Confirm You Want to Backup this Account </SubHeader>
        <FadedText>
          By pressing confirm you will be downloading a JSON keyfile that can later be used to unlock your account.{' '}
        </FadedText>
        <Modal.Actions>
          <Stacked>
            <FadedText> Please encrypt your account first with the account&apos;s password. </FadedText>
            <Input onChange={handler(setPassword)} type='password' value={password} />
            <StackedHorizontal>
              <WithSpaceBetween>
                <StyledLinkButton onClick={closeBackupModal}>
                  <Icon name='remove' color='red' /> <FadedText>Cancel</FadedText>
                </StyledLinkButton>
                <StyledLinkButton onClick={backupCurrentAccount}>
                  <Icon name='checkmark' color='green' /> <FadedText>Confirm Backup</FadedText>
                </StyledLinkButton>
              </WithSpaceBetween>
            </StackedHorizontal>
          </Stacked>
        </Modal.Actions>
      </WithSpaceAround>
    </Modal>
  );
}
