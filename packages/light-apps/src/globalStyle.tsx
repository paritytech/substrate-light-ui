// Copyright 2017-2018 @polkadot/light-apps authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  html {
    height: 100%;
  }

  body {
    height: 100%;
    width: 100%;
    display: flex;
    justify-content: center;
    margin: 0;
    padding: 0;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans',
      'Droid Sans', 'Helvetica Neue', sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
`;

const substrateLightTheme = {
  black: '#222',
  cardBorder: '#f2f2f2',
  darkBlue: '#5c53fc',
  grey: '#888',
  lightBlue1: '#53a0fd',
  lightBlue2: '#51a0ec',
  purple: '#8479f3',
  segment: '#fdfefe',
  white: '#ffffff'
};

export { substrateLightTheme, GlobalStyle };
