// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ApiGate } from '@polkadot/ui-api';
import substrateLogo from '@polkadot/ui-assets/parity-substrate.svg';
import { Provider } from 'mobx-react';
import * as React from 'react';
import { BrowserRouter, NavLink, Route } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import 'semantic-ui-css/semantic.min.css';

import { Content } from './Content';
import { GlobalStyle, substrateLightTheme } from './globalStyle';
import * as rootStore from './stores';

export class App extends React.PureComponent {
  render () {
    return (
      <Provider {...rootStore}>
        <ApiGate>
          <ThemeProvider theme={substrateLightTheme}>
            <BrowserRouter>
              <React.Fragment>
                <GlobalStyle theme={substrateLightTheme} />
                <NavLink to='/'>
                  <img
                    src={substrateLogo}
                    height={100}
                    width={150}
                  />
                </NavLink>
                <Route component={Content} />
              </React.Fragment>
            </BrowserRouter >
          </ThemeProvider>
        </ApiGate>
      </Provider>
    );
  }

}
