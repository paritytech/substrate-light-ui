// Copyright 2018-2020 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import 'semantic-ui-css/semantic.min.css';
//TODO: tachyons.css from ui-components
import 'tachyons/css/tachyons.css';

import { GlobalStyle, substrateLightTheme } from '@substrate/ui-components';
import React from 'react';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';
import styled, { ThemeProvider } from 'styled-components';

import { Alerts, ContextGate } from './components';
import { Routes } from './pages';

// Use MemoryRouter for production viewing in file:// protocol
// https://github.com/facebook/create-react-app/issues/3591
// FIXME Don't use any, but we have the following error:
// JSX element type 'Router' does not have any construct or call signatures.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Router: any =
  process.env.NODE_ENV === 'production' ? MemoryRouter : BrowserRouter;

// Let this div take up whole screen
const FullScreen = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100%;
`;

export function App(): React.ReactElement {
  return (
    <Router>
      <ThemeProvider theme={substrateLightTheme}>
        <GlobalStyle />
        <FullScreen>
          <ContextGate>
            <Routes />
          </ContextGate>
        </FullScreen>
        <Alerts />
      </ThemeProvider>
    </Router>
  );
}
