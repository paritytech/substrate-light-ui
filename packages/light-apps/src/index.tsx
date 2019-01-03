// Copyright 2017-2018 @polkadot/light-apps authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import { NavLink, Route } from 'react-router-dom';
import { Provider } from 'mobx-react';
import substrateLogo from '@polkadot/ui-assets/parity-substrate.svg';
import 'semantic-ui-css/semantic.min.css';

import { Content } from './Content';
import { createApp } from './createApp';
import { GlobalStyle } from './globalStyle';
import * as rootStore from './stores';

function App () {
  return (
    <div>
      <GlobalStyle />
      <NavLink to='/'>
        <img
          src={substrateLogo}
          height={100}
          width={150}
        />
      </NavLink>
      <Provider {...rootStore}>
        <Route path='/' component={Content} />
      </Provider>
    </div>
  );
}
createApp(App);
