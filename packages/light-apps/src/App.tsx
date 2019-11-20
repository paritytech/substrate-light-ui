// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AppContext, ContextGate } from '@substrate/context';
import { FixedWidthContainer, GlobalStyle, Loading, substrateLightTheme } from '@substrate/ui-components';
import React from 'react';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import 'semantic-ui-css/semantic.min.css';

import { Alerts } from './Alerts';
import { Content } from './Content';
import { TopBar } from './TopBar';

// Use MemoryRouter for production viewing in file:// protocol
// https://github.com/facebook/create-react-app/issues/3591
// FIXME Don't use any, but we have the following error:
// JSX element type 'Router' does not have any construct or call signatures.
const Router: any =
  process.env.NODE_ENV === 'production' ? MemoryRouter : BrowserRouter;

export function App (): React.ReactElement {
  return (
    <ContextGate>
      <Router>
        <ThemeProvider theme={substrateLightTheme}>
          <FixedWidthContainer>
            <GlobalStyle />
            <AppContext.Consumer>
              {({ isReady }): React.ReactElement => isReady
                ? <React.Fragment>
                  <TopBar />
                  <Content />
                </React.Fragment>
                : <Loading active>
                  Connecting to the node...
                </Loading>
              }
            </AppContext.Consumer>
            <Alerts />
          </FixedWidthContainer>
        </ThemeProvider>
      </Router>
    </ContextGate>
  );
}
