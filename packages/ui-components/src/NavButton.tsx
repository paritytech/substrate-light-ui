// Copyright 2018-2020 @paritytech/Nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';

import { StyledNavButton } from './Shared.styles';
import { StyledNavButtonProps } from './StyleProps';
import { FontSize } from './types';

interface NavButtonProps extends StyledNavButtonProps {
  className?: string;
  fontSize?: FontSize;
  fontWeight?: string;
  text?: boolean;
  value?: string;
  negative?: boolean;
  wrapClass?: string;
}

// TEMPORARY, to be moved to shared/constants
const tachyons = {
  default: 'bg-black white f4',
  negative: 'bg-white black f4',
};

export function NavButton(props: NavButtonProps): React.ReactElement {
  const { children, className, negative, value, ...rest } = props;

  const tachyonsClass = `
    ${
      className
        ? className
        : negative
        ? tachyons['negative']
        : tachyons['default']
    }
  `;

  return (
    <StyledNavButton className={tachyonsClass} {...rest}>
      {value || children}
    </StyledNavButton>
  );
}
