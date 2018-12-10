// Copyright 2017-2018 @polkadot/light-apps authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Icon, Menu } from '@polkadot/ui-components';
import { Route } from '../types';

import React from 'react';
import { NavLink } from 'react-router-dom';
import { withRouter } from 'react-router';

type Props = {
  route: Route
};

class Item extends React.PureComponent<Props> {
  render () {
    const { route: { icon, name } } = this.props;

    return (
      <Menu.Item className='apps--SideBar-Item'>
        <NavLink
          activeClassName='apps--SideBar-Item-NavLink-active'
          className='apps--SideBar-Item-NavLink'
          to={`/${name}`}
        >
          <Icon name={icon} /> {`${name}`}
        </NavLink>
      </Menu.Item>
    );
  }
}

export default withRouter(Item);
