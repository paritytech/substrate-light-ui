// Copyright 2018-2020 @paritytech/Nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import styled from 'styled-components';

import { mergeClasses } from './util/tachyons';

interface NavButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
  value?: string;
  negative?: boolean;
  wrapClass?: string;
}

const StyledNavButton = styled.button<NavButtonProps>`
  border: none;
  border-radius: 9999px;
  outline: none;
  overflow: hidden;
  transition: background-color 0.3s;
  padding: 0.5em 2.5em;

  :hover {
    opacity: 0.9;
    cursor: ${(props): string => (props.disabled ? 'not-allowed' : 'pointer')};
  }
`;

// TEMPORARY, to be moved to shared/constants
const tachyons = {
  default: 'bg-black white f4 fw4',
  negative: 'bg-white black f4 fw4',
};

export function NavButton(props: NavButtonProps): React.ReactElement {
  const { children, className, negative, value, wrapClass, ...rest } = props;

  const tachyonsClass = `
    ${negative ? tachyons['negative'] : tachyons['default']}
  `;

  return (
    <div className={wrapClass}>
      <StyledNavButton
        className={mergeClasses(tachyonsClass, className)}
        {...rest}
      >
        {value || children}
      </StyledNavButton>
    </div>
  );
}
