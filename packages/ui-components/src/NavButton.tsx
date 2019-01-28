// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';

import { NavLinkBig } from './Shared.styles';

type Props = {
  children?: any,
  value?: string
  onClick?: () => void
};

export default class NavButton extends React.PureComponent<Props> {
  render () {
    const { children, onClick, value } = this.props;

    return (
      <NavLinkBig onClick={onClick}>
        {value}
        {children}
      </NavLinkBig>
    );
  }
}
