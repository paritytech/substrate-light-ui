// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import 'semantic-ui-css/semantic.min.css';
import { AppContext, ContextGate } from '@substrate/ui-common';
import { Container, GlobalStyle, Loading, substrateLightTheme } from '@substrate/ui-components';
import { ThemeProvider } from 'styled-components';

import { Alerts } from './Alerts';
import { Content } from './Content';
import { TopBar } from './TopBar';
import { TxQueueNotifier } from './TxQueueNotifier';

export class App extends React.PureComponent {
  render () {
    return (
      <ContextGate>
        <ThemeProvider theme={substrateLightTheme}>
          <BrowserRouter>
            <Container>
              <GlobalStyle />
              <AppContext.Consumer>
                {({ isReady, url }) => isReady
                  ? <React.Fragment>
                      <TopBar />
                      <Content />
                    </React.Fragment>
                  : <Loading active>
                      Connecting to the node at {url}...
                    </Loading>}
              </AppContext.Consumer>
              <TxQueueNotifier />
              <Alerts />
            </Container>
          </BrowserRouter >
        </ThemeProvider>
      </ContextGate>
    );
  }
}
