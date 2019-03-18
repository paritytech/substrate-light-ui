// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';

import { DynamicSizeText, StyledNavLink } from './Shared.styles';

type Props = {
  children?: React.ReactNode,
  fontSize?: string,
  fontWeight?: string,
  onClick?: (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => void,
  to: string,
  value?: string
};

export default class NavLink extends React.PureComponent<Props> {
  render () {
    const { children, fontSize = '17px', fontWeight = '300', onClick, to, value } = this.props;

    return (
      <StyledNavLink onClick={onClick} to={to}>
        <DynamicSizeText
          fontSize={fontSize}
          fontWeight={fontWeight}>
          {value || children}
        </DynamicSizeText>
      </StyledNavLink>
    );
  }
}
