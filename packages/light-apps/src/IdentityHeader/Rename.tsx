// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AlertsContext, AppContext, getKeyringAccount, handler } from '@substrate/ui-common';
import { Dropdown, FadedText, Icon, Input, Modal, Stacked, StackedHorizontal, StyledLinkButton, WithSpaceAround, WithSpaceBetween } from '@substrate/ui-components';
import React, { useContext, useState } from 'react';

interface Props {
  currentAccount: string;
}

export function Rename (props: Props) {
  const { currentAccount } = props;
  const { keyring } = useContext(AppContext);
  const { enqueue } = useContext(AlertsContext);

  const keyringAccount = getKeyringAccount(keyring, currentAccount);

  // Rename modal
  const [modalOpen, setModalOpen] = useState(false);
  const [name, setName] = useState(keyringAccount.map((account) => account.getMeta().name || '').getOrElse(''));

  const openRenameModal = () => setModalOpen(true);
  const closeRenameModal = () => { setModalOpen(false); setName(name); };

  const renameCurrentAccount = () => {
    keyring.saveAccountMeta(keyring.getPair(currentAccount), { name });

    closeRenameModal();
    enqueue({ content: 'Successfully renamed account!', type: 'success' });
  };

  return (
    <Modal closeOnDimmerClick closeOnEscape open={modalOpen} trigger={<Dropdown.Item icon='edit' onClick={openRenameModal} text='Rename Account' />}>
      <WithSpaceAround>
        <Stacked>
          <Modal.SubHeader>Rename account</Modal.SubHeader>
          <FadedText>Please enter the new name of the account.</FadedText>
          <Modal.Actions>
            <Stacked>
              <FadedText>Account name</FadedText>
              <Input onChange={handler(setName)} type='text' value={name} />
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
}
