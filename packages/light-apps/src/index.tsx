// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import substrateLogo from '@polkadot/ui-assets/parity-substrate.svg';
import { Provider } from 'mobx-react';
import React from 'react';
import { HashRouter, NavLink, Route } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import 'semantic-ui-css/semantic.min.css';

import { Content } from './Content';
import { createApp } from './createApp';
import { GlobalStyle, substrateLightTheme } from './globalStyle';
import * as rootStore from './stores';

function App () {
  return (
    <HashRouter>
      <React.Fragment>
        <ThemeProvider theme={substrateLightTheme}>
          <div>
            <GlobalStyle theme={substrateLightTheme} />
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
        </ThemeProvider>
      </React.Fragment>
    </HashRouter>
  );
}

createApp(App);
