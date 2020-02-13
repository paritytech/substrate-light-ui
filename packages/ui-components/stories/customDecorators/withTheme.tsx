// Copyright 2018-2020 @paritytech/Nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import { ThemeProvider } from 'styled-components';

import { GlobalStyle, substrateLightTheme } from '../../src/globalStyle';

export const withTheme = (
  storyFn: () => React.ReactElement
): React.ReactElement => {
  return (
    <React.Fragment>
      <GlobalStyle />
      <ThemeProvider theme={substrateLightTheme}>{storyFn()}</ThemeProvider>
    </React.Fragment>
  );
};
