// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import SUIModal, { ModalProps as SUIModalProps } from 'semantic-ui-react/dist/commonjs/modules/Modal/Modal';
import styled from 'styled-components';

import { Header, FadedText, SubHeader } from './Shared.styles';

type ModalProps = SUIModalProps;

const StyledModal = styled(SUIModal)`
  &&& {
    position: ${(props): string => props.position || 'relative'};
    bottom: ${(props): string | undefined => props.bottom || undefined};
    right: ${(props): string | undefined => props.right || undefined};
  }
`;

const StyledContent = styled(SUIModal.Content)`
  &&& {
    display: flex;
    align-items: ${(props): string => props.alignItems || 'center'};
    justify-content: ${(props): string => props.justifyContent || 'center'};
    min-width: 100%;
  }
`;

const StyledActions = styled(StyledContent)`
  margin-top: 2rem;
`;

// FIXME: this component is reused here and in @polkadot/apps - should be moved to @polkadot/ui
export function Modal (props: ModalProps): React.ReactElement {
  return (
    <StyledModal {...props} />
  );
}

Modal.Actions = StyledActions;
Modal.Content = StyledContent;
Modal.Header = Header;
Modal.SubHeader = SubHeader;
Modal.FadedText = FadedText;
Modal.Description = SUIModal.Description;
