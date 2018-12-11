// Copyright 2017-2018 @polkadot/light-apps authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import { NavLink } from 'react-router-dom';
import { BareProps, Icon, createApp, settings } from '@polkadot/ui-components';

import * as serviceWorker from './serviceWorker';
import SideBar from './Navigation/SideBar';

import { NavStyles } from './Navigation/NavStyles';
import { GlobalStyle } from './globalStyle';

import substrateLogo from './static/parity-substrate.svg';

type Props = BareProps & {};
type State = {
  visible: boolean
};

const LOGO = substrateLogo;

class App extends React.PureComponent<Props, State> {
  state: State;

  constructor (props: Props) {
    super(props);

    this.state = {
      visible: true
    };
  }

  toggleSideBar = () => this.setState({ visible: !this.state.visible });

  render () {
    const { visible } = this.state;

    return (
      <div className={'apps--App'}>
        <GlobalStyle />
        <NavStyles>
          <Icon name='bars' onClick={this.toggleSideBar} id='toggleSideNav' />
          {!visible &&
            <NavLink to={'/'}>
              <img
                className='apps--SideBar-logo closed'
                src={LOGO}
                />
            </NavLink>
          }
          <SideBar visible={visible}/>
        </NavStyles>
      </div>
    );
  }
}

const url = !settings.apiUrl
  ? undefined
  : settings.apiUrl;

createApp(App, { url });

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
