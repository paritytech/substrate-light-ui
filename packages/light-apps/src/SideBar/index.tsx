// Copyright 2017-2018 @polkadot/light-apps authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import { Icon, Menu, Sidebar } from '@polkadot/ui-components';
import { NavLink } from 'react-router-dom';

import { Item } from './Item';
import { SideBarStyles } from './SideBarStyles';
import substrateLogo from '../static/parity-substrate.svg';
import routing from '../routing';

type Props = {};

const LOGO = substrateLogo;

class SideBar extends React.PureComponent<Props> {
  render () {
    const { children } = this.props;

    return (
      <SideBarStyles>
        <Sidebar
          as={Menu}
          icon='labeled'
          visible
          vertical
          width='wide'
        >
          <NavLink
            className='apps--SideBar-Item-NavLink'
            to={'/'}
          >
            <img
              alt='substrate'
              className='apps--SideBar-logo'
              src={LOGO}
            />
          </NavLink>

          <Menu.Divider hidden />

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
              href='https://github.com/polkadot-js/light-ui'>
              <Icon name='github' /> GitHub
            </a>
          </Menu.Item>
          <Menu.Divider hidden />
          {children}
        </Sidebar>
      </SideBarStyles>
    );
  }
}

// @ts-ignore
export default SideBar;
