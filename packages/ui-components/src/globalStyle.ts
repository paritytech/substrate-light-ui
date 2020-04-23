// Copyright 2018-2020 @paritytech/Nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import 'tachyons/css/tachyons.min.css';
import './assets/fonts/Inter/inter.css';
import './assets/fonts/Roboto_Mono/roboto_mono.css';

import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
  html {
    height: 100%;
  }

  body {
    height: 100%;
    margin: 0;
    padding: 0;
  }

  #root {
    height: 100%;
  }

  html, body, h1, .h1, h2, .h2, h3, .h3, h4, .h4, h5, .h5, h6, .h6, p, [type="text"] {
    font-family: 'Inter', 'Montseratt', 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif !important;
  }
  code, .code, th, button, button p, .menu .item, label, [type="number"] {
    font-family: 'Roboto Mono' !Important;
  }

  //TODO: dimmer component
  .dimmer {
    background-color: rgba(255,255,255,0.6) !important;
    height: calc(100vh - 104px) !important;
    transform: translateY(104px);
    justify-content: flex-start !important;
    padding-top: 0 !important;
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
  white: '#ffffff',
};

export const polkadotOfficialTheme = {
  typography: {
    monospace: "'Roboto Mono' !important",
  },
  black: '#191919',
  green: '#79F676',
  shadow: 'rgba(210, 210, 210, 0.6)',
  grey: '#B5AEAE',
  hotPink: '#E6007A',
  signal: 'red',
  lightBlue2: '#51a0ec',
  lightBlue1: '#53a0fd',
  neonBlue: '#0ed2f7',
  maroon: '#670D35',
  eggShell: '#f2f2f2',
  white: '#ffffff',
};

export const theme = { ...substrateLightTheme, ...polkadotOfficialTheme };

export type Color = keyof typeof substrateLightTheme &
  keyof typeof polkadotOfficialTheme;

export type StyledProps = {
  theme: typeof substrateLightTheme & typeof polkadotOfficialTheme;
  substrateTheme: typeof substrateLightTheme;
  polkadotTheme: typeof polkadotOfficialTheme;
};
