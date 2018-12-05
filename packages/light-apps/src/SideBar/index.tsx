// Copyright 2017-2018 @polkadot/light-apps authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Icon, I18nProps, Menu } from '@polkadot/ui-components';

import React from 'react';
import routing from '../routing';
import translate from '../translate';

import Item from './Item';
import SUBSTRATE_LOGO from '../static/parity-substrate-white.svg';

type Props = I18nProps & {
  children?: React.ReactNode
};

class SideBar extends React.Component<Props> {
  render () {
    const { children, t } = this.props;

    return (
      <div className='apps--SideBar'>
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
                    t={t}
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
      </div>
    );
  }
}

// @ts-ignore
export default translate(SideBar);
