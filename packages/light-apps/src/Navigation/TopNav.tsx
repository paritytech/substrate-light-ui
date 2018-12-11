// Copyright 2017-2018 @polkadot/light-apps authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import { NavLink } from 'react-router-dom';
import { Icon, Menu } from '@polkadot/ui-components';

import substrateLogo from '../static/parity-substrate-white.svg';

type Props = {
  toggleSideBar: () => void
};

const LOGO = substrateLogo;

export class TopNav extends React.PureComponent<Props> {
  render () {
    const { toggleSideBar } = this.props;

    return (
      <Menu borderless inverted className='apps--TopNav'>
        <Menu.Item
          content={<Icon name='bars'/>}
          onClick={toggleSideBar}
        />

        <Menu.Item
          content={<NavLink
            className='apps--SideBar-Item-NavLink'
            to={'/'}
          >
            <img
              alt='substrate'
              className='apps--SideBar-logo'
              src={LOGO}
            />
          </NavLink>}
        />
      </Menu>
    );
  }
}
