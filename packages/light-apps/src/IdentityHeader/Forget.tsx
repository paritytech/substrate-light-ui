// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AppContext, AlertsContext } from '@substrate/ui-common';
import { Dropdown, FadedText, Icon, Margin, Modal, Stacked, StackedHorizontal, StyledLinkButton, WithSpaceAround } from '@substrate/ui-components';
import H from 'history';
import React, { useContext, useState } from 'react';

interface Props {
  currentAccount: string;
  history: H.History;
}

export function Forget (props: Props) {
  const { currentAccount, history } = props;
  const { keyring } = useContext(AppContext);
  const { enqueue } = useContext(AlertsContext);

  const [forgetModalOpen, setForgetModalOpen] = useState(false);

  const openForgetModal = () => setForgetModalOpen(true);
  const closeForgetModal = () => setForgetModalOpen(false);

  const forgetCurrentAccount = () => {
    try {
      // forget it from keyring
      keyring.forgetAccount(currentAccount);

      closeForgetModal();
      history.push('/');
    } catch (e) {
      enqueue({ content: e.message, type: 'error' });
    }
  };

  return (
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
  );
}
