// Copyright 2017-2018 @polkadot/light-apps authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import { NavLink } from 'react-router-dom';
import { Button } from '@polkadot/ui-components';

type Props = {
  to?: string,
  value?: string
};

export class NavButton extends React.PureComponent<Props> {
  render () {
    const { to, value } = this.props;

    return (
      <NavLink to={to}>
        <Button>
          {value}
        </Button>
      </NavLink>
    );
  }
}
