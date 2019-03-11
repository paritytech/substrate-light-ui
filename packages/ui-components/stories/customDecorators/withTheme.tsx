// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import { ThemeProvider } from 'styled-components';

import { GlobalStyle, substrateLightTheme } from '../../src/globalStyle';

export const withTheme = (storyFn) => {
  return (
    <ThemeProvider theme={substrateLightTheme}>
      <React.Fragment>
        <GlobalStyle />
        {storyFn()}
      </React.Fragment>
    </ThemeProvider>
  );
};
