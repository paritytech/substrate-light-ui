// Copyright 2017-2018 @polkadot/light-apps authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';

import { BareProps, createApp, settings } from '@polkadot/ui-components';

import * as serviceWorker from './serviceWorker';
import SideBar from './Navigation/SideBar';
import TopNav from './Navigation/TopNav';

import { NavStyles } from './Navigation/NavStyles';
import { GlobalStyle } from './globalStyle';

type Props = BareProps & {};
type State = {
  visible: boolean
};

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
          <TopNav toggleSideBar={this.toggleSideBar} />
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
