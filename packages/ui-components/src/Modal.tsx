// Copyright 2017-2018 @polkadot/light-apps authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import styled from 'styled-components';
import SUIModal from 'semantic-ui-react/dist/commonjs/modules/Modal/Modal';

import { Header, FadedText, SubHeader, Stacked } from './Shared.styles';

type Props = {
  [index: string]: any
};

// FIXME: don't use any
const StyledContent = styled<any>(SUIModal.Content)`
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
export default class Modal extends React.PureComponent<Props> {
  static Actions = StyledActions;
  static Content = StyledContent;
  static Header = Header;
  static SubHeader = SubHeader;
  static FadedText = FadedText;
  static Description = SUIModal.Description;

  render () {
    return (
      <SUIModal
        {...this.props}
      />
    );
  }
}
