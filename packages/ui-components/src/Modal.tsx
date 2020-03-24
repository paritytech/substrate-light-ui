// Copyright 2018-2020 @paritytech/Nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import SUIModal, {
  ModalProps as SUIModalProps,
} from 'semantic-ui-react/dist/commonjs/modules/Modal/Modal';
import styled from 'styled-components';

import { FadedText, SubHeader } from './Shared.styles';

type ModalProps = SUIModalProps;

const StyledModal = styled(SUIModal)`
  &&& {
    position: ${(props): string => props.position || 'relative'};
    bottom: ${(props): string | undefined => props.bottom || undefined};
    right: ${(props): string | undefined => props.right || undefined};
    width: 80%;
    max-width: 750px;
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  }
`;

const StyledContent = styled(SUIModal.Content)`
  &&& {
    display: flex;
    align-items: ${(props): string => props.alignItems || 'center'};
    justify-content: ${(props): string => props.justifyContent || 'center'};
    min-width: 100%;
    padding-top: 1rem;
  }
`;

const StyledActions = styled(StyledContent)``;

const StyledHeader = styled(SUIModal.Header)`
  &&& {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    padding-top: 2rem;
    padding-bottom: 0;
    border-bottom: none;
    font-size: 1.75rem !important;
    font-weight: 200;
  }
`;

const StyledSubHeader = styled(SubHeader)`
  &&& {
    padding: 0 3rem 0 3rem;
  }
`;

export function Modal(props: ModalProps): React.ReactElement {
  return <StyledModal {...props} />;
}

Modal.Actions = StyledActions;
Modal.Content = StyledContent;
Modal.Header = StyledHeader;
Modal.SubHeader = StyledSubHeader;
Modal.FadedText = FadedText;
Modal.Description = SUIModal.Description;
