// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';

import { DynamicSizeText, StyledNavLink } from './Shared.styles';
import { StyledNavLinkProps } from './StyleProps';
import { FontSize } from './types';

interface Props extends StyledNavLinkProps {
  fontSize?: FontSize;
  fontWeight?: string;
  value?: string;
}

export class NavLink extends React.PureComponent<Props> {
  render () {
    const { children, fontSize = 'medium', fontWeight = '300', value, ...rest } = this.props;

    return (
      <StyledNavLink {...rest}>
        <DynamicSizeText
          fontSize={fontSize}
          fontWeight={fontWeight}>
          {value || children}
        </DynamicSizeText>
      </StyledNavLink>
    );
  }
}
