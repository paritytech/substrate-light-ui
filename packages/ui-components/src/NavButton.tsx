// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';

import { DynamicSizeText, StyledNavButton } from './Shared.styles';
import { FontSize } from './types';

interface NavButtonProps extends React.AllHTMLAttributes<HTMLButtonElement> {
  children?: any;
  fontSize?: FontSize;
  fontWeight?: string;
  value?: string;
}

export function NavButton (props: NavButtonProps) {
  const { children, fontSize = 'medium', fontWeight = '300', value, ...rest } = props;

  return (
    // @ts-ignore FIXME I can't get this to work, though it should...
    <StyledNavButton {...rest}>
      <DynamicSizeText
        fontSize={fontSize}
        fontWeight={fontWeight}>
        {value || children}
      </DynamicSizeText>
    </StyledNavButton>
  );
}
