// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
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
  }
`;

// ordered darkest to lightest
export const substrateLightTheme = {
  black: '#222',
  grey: '#888',
  redOrange: '#ff3400',
  coral: '#ff5d3e',
  tangerine: '#f68a04',
  orangeYellow: '#ffae00',
  hotPink: '#ff008d',
  electricPurple: '#a030ec',
  purple: '#8479f3',
  darkBlue: '#5c53fc',
  lightBlue2: '#51a0ec',
  lightBlue1: '#53a0fd',
  neonBlue: '#0ed2f7',
  robinEggBlue: '#86fff9',
  eggShell: '#f2f2f2',
  white: '#ffffff'
};

export type Color = keyof typeof substrateLightTheme;

export type StyledProps = {
  theme: typeof substrateLightTheme
}
