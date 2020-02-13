// Copyright 2018-2020 @paritytech/Nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React, { useState } from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';
import styled from 'styled-components';

import { Icon } from './Icon';
import { Stacked } from './Shared.styles';

type CopyButtonProps = {
  value?: string;
};

const StyledCopyButton = styled.button`
  border: none;
  background-color: inherit;
  color: ${(props): string => props.theme.lightBlue1};

  :hover {
    cursor: pointer;
    color: ${(props): string => props.theme.darkBlue};
  }
`;

export function CopyButton(props: CopyButtonProps): React.ReactElement {
  const { value } = props;
  const [copied, setCopied] = useState(false);

  const handleCopied = (): void => {
    setCopied(true);

    setTimeout(() => setCopied(false), 1000);
  };

  return (
    <CopyToClipboard text={value || ''} onCopy={handleCopied}>
      <StyledCopyButton>
        <Stacked>
          <Icon name={copied ? 'check' : 'copy'} />
          {copied && <small> Copied! </small>}
        </Stacked>
      </StyledCopyButton>
    </CopyToClipboard>
  );
}
