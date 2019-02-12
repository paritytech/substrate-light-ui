// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';

import { StyledNavLink } from './Shared.styles';

type Props = {
  children?: React.ReactNode,
  value?: string,
  to: string
};

export default class NavLink extends React.PureComponent<Props> {
  render () {
    const { children, to, value } = this.props;

    return (
      <StyledNavLink to={to}>
        {value}
        {children}
      </StyledNavLink>
    );
  }
}
