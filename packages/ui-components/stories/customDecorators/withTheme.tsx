// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import { ThemeProvider } from 'styled-components';

import { GlobalStyle, substrateLightTheme } from '../../src/globalStyle';
import { RenderFunction } from '../types';

export const withTheme = (storyFn: RenderFunction) => {
  return (
    <React.Fragment>
      <GlobalStyle />
      // @ts-ignore
      // FIXME: signature defined as theme: T | ((theme: T) => T), this should be passing lint
      <ThemeProvider theme={substrateLightTheme}>
        {storyFn()}
      </ThemeProvider>
    </React.Fragment>
  );
};
