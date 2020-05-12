// Copyright 2018-2020 @paritytech/Nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';

interface ParagraphProps {
  children: React.ReactNode;
  className?: string;
  faded?: boolean;
  status?: 'success' | 'error' | 'none';
}

// TEMPORARY, to be moved to shared/constants
const tachyons = {
  default: 'f5 fw4',
  error: 'dark-red fw5',
  faded: 'o-50',
  none: '',
  success: 'green fw5',
};

export function Paragraph(props: ParagraphProps): React.ReactElement {
  const { children, className, faded, status = 'none', ...rest } = props;

  const tachyonsClass = `
    ${className ? className : tachyons['default']}
    ${faded && tachyons['faded']}
    ${status !== 'none' && tachyons[status]} 
  `;

  return (
    <p className={tachyonsClass} {...rest}>
      {children}
    </p>
  );
}
