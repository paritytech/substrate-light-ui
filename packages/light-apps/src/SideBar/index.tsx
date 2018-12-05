// Copyright 2017-2018 @polkadot/light-apps authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Icon, Menu } from '@polkadot/ui-components';
import { SideBarStyles } from './SideBarStyles';

import React from 'react';
import routing from '../routing';
// import translate from '../translate';

import Item from './Item';
import SUBSTRATE_LOGO from '../static/parity-substrate-white.svg';

type Props = {
  children?: React.ReactNode
};

class SideBar extends React.Component<Props> {
  render () {
    const { children } = this.props;

    return (
      <SideBarStyles>
        <Menu
          secondary
          vertical
        >
          <img
            alt='substrate'
            className='apps--SideBar-logo'
            src={SUBSTRATE_LOGO}
          />
          {
            routing.routes
            .filter((route) =>
              !route || !route.isHidden
            )
            .map((route, index) => (
              route
                ? (
                  <Item
                    key={route.name}
                    route={route}
                  />
                )
                : (
                  <Menu.Divider
                    hidden
                    key={index}
                  />
                )
            ))
          }
          <Menu.Divider hidden />
          <Menu.Item className='apps--SideBar-Item'>
            <a
              className='apps--SideBar-Item-NavLink'
              href='https://github.com/polkadot-js/apps'>
              <Icon name='github' /> GitHub
            </a>
          </Menu.Item>
          <Menu.Divider hidden />
          {children}
        </Menu>
      </SideBarStyles>
    );
  }
}

// @ts-ignore
export default SideBar;
