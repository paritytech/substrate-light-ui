// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import SUIModal, { ModalProps as SUIModalProps } from 'semantic-ui-react/dist/commonjs/modules/Modal/Modal';
import styled from 'styled-components';

import { Header, FadedText, SubHeader } from './Shared.styles';

export type ModalProps = SUIModalProps;

const StyledContent = styled(SUIModal.Content)`
  &&& {
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 100%;
  }
`;

const StyledActions = styled(StyledContent)`
  margin-top: 2rem;
`;

// FIXME: this component is reused here and in @polkadot/apps - should be moved to @polkadot/ui
export function Modal (props: ModalProps) {
  return (
    <SUIModal {...props} />
  );
}

Modal.Actions = StyledActions;
Modal.Content = StyledContent;
Modal.Header = Header;
Modal.SubHeader = SubHeader;
Modal.FadedText = FadedText;
Modal.Description = SUIModal.Description;
