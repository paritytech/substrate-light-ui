// Copyright 2018-2020 @paritytech/Nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import SUIModal, {
  ModalProps as SUIModalProps,
} from 'semantic-ui-react/dist/commonjs/modules/Modal/Modal';
import styled from 'styled-components';

import { mergeClasses } from './util/tachyons';

type ModalProps = SUIModalProps;

const StyledModal = styled(SUIModal)`
  &&& {
    position: ${(props): string => props.position || 'relative'};
    width: 95%;
    bottom: ${(props): string | undefined => props.bottom || undefined};
    right: ${(props): string | undefined => props.right || undefined};
    margin-top: 0 !important;
    max-width: 750px;
    margin: 0 auto;
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  }
`;

const StyledHeader = styled(SUIModal.Header)`
  &&& {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    padding-bottom: 0;
    border-bottom: none;
    border-radius: 0 !important;
    font-size: 1.75rem !important;
    font-weight: 200;
  }
`;

const tachyons = {
  default: 'pv4 ph5',
};

export function Modal(props: ModalProps): React.ReactElement {
  const { className, ...rest } = props;
  return (
    <StyledModal
      className={mergeClasses(tachyons['default'], className)}
      {...rest}
    />
  );
}

Modal.Actions = SUIModal.Content;
Modal.Content = SUIModal.Content;
Modal.Header = StyledHeader;
Modal.Description = SUIModal.Description;
