// Copyright 2017-2018 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import { NavLinkSmall } from './Shared.styles';

type Props = {
  children?: any,
  value?: string,
  onClick?: () => void
};

export default class NavLink extends React.PureComponent<Props> {
  render () {
    const { children, onClick, value } = this.props;

    return (
      <NavLinkSmall onClick={onClick}>
        {value}
        {children}
      </NavLinkSmall>
    );
  }
}
