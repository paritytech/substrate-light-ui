// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import 'semantic-ui-css/semantic.min.css';
import substrateLogo from '@polkadot/ui-assets/parity-substrate.svg';
import { AppContext, ContextGate } from '@substrate/ui-common';
import { GlobalStyle, Loading, NavLink, substrateLightTheme } from '@substrate/ui-components';
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';

import { Alerts } from './Alerts';
import { Content } from './Content';

export class App extends React.PureComponent {
  render () {
    return (
      <ContextGate>
        <ThemeProvider theme={substrateLightTheme}>
          <BrowserRouter>
            <React.Fragment>
              <GlobalStyle />
              <NavLink to='/'>
                <img
                  src={substrateLogo}
                  height={100}
                  width={150}
                />
              </NavLink>
              <AppContext.Consumer>
                {({ isReady }) => isReady ? <Content /> : <Loading active />}
              </AppContext.Consumer>
              <Alerts />
            </React.Fragment>
          </BrowserRouter >
        </ThemeProvider>
      </ContextGate>
    );
  }
}
