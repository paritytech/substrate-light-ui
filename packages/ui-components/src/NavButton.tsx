// Copyright 2018-2020 @paritytech/Nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';

import {
  ButtonShadow,
  DynamicSizeText,
  StyledNavButton,
} from './Shared.styles';
import { StyledNavButtonProps } from './StyleProps';
import { FontSize } from './types';

interface NavButtonProps extends StyledNavButtonProps {
  fontSize?: FontSize;
  fontWeight?: string;
  value?: string;
  wrapClass?: string;
}

export function NavButton(props: NavButtonProps): React.ReactElement {
  const {
    children,
    fontSize = 'large',
    fontWeight = '300',
    value,
    wrapClass,
    ...rest
  } = props;

  return (
    <div className={wrapClass}>
      <StyledNavButton {...rest}>
        <DynamicSizeText fontSize={fontSize} fontWeight={fontWeight}>
          {value || children}
        </DynamicSizeText>
        <ButtonShadow />
      </StyledNavButton>
    </div>
  );
}
