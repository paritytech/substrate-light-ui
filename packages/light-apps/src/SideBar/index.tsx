// Copyright 2017-2018 @polkadot/light-apps authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import { Icon, Menu, Segment, Sidebar } from '@polkadot/ui-components';
import { NavLink } from 'react-router-dom';

import Item from './Item';
import { SideBarStyles } from './SideBarStyles';
import Content from '../Content/index';
import substrateLogo from '../static/parity-substrate.svg';
import routing from '../routing';

type Props = {
  children?: React.ReactNode
};

type State = {
  visible: boolean
};

const LOGO = substrateLogo;

class SideBar extends React.Component<Props, State> {
  state: State;

  constructor (props: Props) {
    super(props);

    this.state = {
      visible: true
    };
  }

  handleHideClick = () => this.setState({ visible: false });
  handleShowClick = () => this.setState({ visible: true });

  render () {
    const { visible } = this.state;
    const { children } = this.props;

    return (
      <SideBarStyles>
          <button disabled={visible} onClick={this.handleShowClick}>
            Show sidebar
          </button>
          <button disabled={!visible} onClick={this.handleHideClick}>
            Hide sidebar
          </button>
        <Sidebar.Pushable as={Segment} className='apps--SideBar'>
          <Sidebar
            as={Menu}
            animation='push'
            direction='left'
            icon='labeled'
            visible={visible}
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
            </Sidebar>

            <Sidebar.Pusher className='apps--SideBar-Pusher'>
              <Segment basic>
                <Content />
              </Segment>
            </Sidebar.Pusher>
          </Sidebar.Pushable>
          {children}
      </SideBarStyles>
    );
  }
}

// @ts-ignore
export default SideBar;
