// Copyright 2018-2020 @paritytech/Nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import styled from 'styled-components';

interface ParagraphProps {
  children: React.ReactNode;
  className?: string;
  faded?: boolean;
  status?: 'success' | 'error' | undefined;
}

// TEMPORARY, to be moved to shared/constants
const tachyons = {
  default: 'f5 fw4',
  error: 'dark-red fw5',
  faded: 'o-50',
  success: 'green fw5',
};

export function Paragraph(props: ParagraphProps): React.ReactElement {
  const { children, className, faded, status = undefined, ...rest } = props;

  const tachyonsClass = `
    ${className ? className : tachyons['default']}
    ${faded ? tachyons['faded'] : ''}
    ${status !== undefined ? tachyons[status] : ''} 
  `;

  const StyledParagraph = styled.p.attrs({
    className: tachyonsClass,
  })``;

  return <StyledParagraph {...rest}>{children}</StyledParagraph>;
}
