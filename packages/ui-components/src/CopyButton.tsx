// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';
import styled from 'styled-components';

import { Icon } from './index';

type Props = {
  value?: string
};

type State = {
  copied: boolean
};

const StyledCopyButton = styled.button`
  border: none;
  background-color: inherit;
  color: ${props => props.theme.lightBlue1};

  :hover {
    cursor: pointer;
    color: ${props => props.theme.darkBlue};
  }
`;

export default class CopyButton extends React.PureComponent<Props, State> {
  state: State = {
    copied: false
  };

  handleCopied = () => {
    this.setState({ copied: true });

    setTimeout(() => this.setState({ copied: false }), 1000);
  }

  render () {
    const { copied } = this.state;
    const { value } = this.props;

    return (
      <CopyToClipboard text={value || ''} onCopy={this.handleCopied}>
        <StyledCopyButton>
          <Icon name={copied ? 'check' : 'copy'} />
          {copied && <small> Copied! </small>}
        </StyledCopyButton>
      </CopyToClipboard>
    );
  }
}
