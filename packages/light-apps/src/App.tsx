// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';
import 'semantic-ui-css/semantic.min.css';
import { AppContext, ContextGate } from '@substrate/ui-common';
import { Container, GlobalStyle, Loading, substrateLightTheme } from '@substrate/ui-components';
import { ThemeProvider } from 'styled-components';

import { Alerts } from './Alerts';
import { Content } from './Content';
import { TopBar } from './TopBar';
import { TxQueueNotifier } from './TxQueueNotifier';

// Use MemoryRouter for production viewing in file:// protocol
// https://github.com/facebook/create-react-app/issues/3591
// FIXME Don't use any, but we have the following error:
// JSX element type 'Router' does not have any construct or call signatures.
const Router: any =
  process.env.NODE_ENV === 'production' ? MemoryRouter : BrowserRouter;

export function App () {
  return (
    <ContextGate>
      <ThemeProvider theme={substrateLightTheme}>
        <Router>
          <Container>
            <GlobalStyle />
            <AppContext.Consumer>
              {({ isReady }) => isReady
                ? <React.Fragment>
                  <TopBar />
                  <Content />
                </React.Fragment>
                : <Loading active>
                  Connecting to the node...
                    </Loading>}
            </AppContext.Consumer>
            <TxQueueNotifier />
            <Alerts />
          </Container>
        </Router>
      </ThemeProvider>
    </ContextGate>
  );
}
