// Copyright 2018-2020 @paritytech/Nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import 'semantic-ui-css/semantic.min.css';
import { configure } from '@storybook/react';
import { addDecorator } from '@storybook/react';
import { ThemeProvider } from 'styled-components';
import { withThemePlayground } from 'storybook-addon-theme-playground';
import { polkadotOfficialTheme, substrateLightTheme } from '../src/globalStyle';

const req = require.context('../stories', true, /.stories.tsx$/);

const options = {
  theme: [
    { name: 'Polkadot', theme: polkadotOfficialTheme },
    { name: 'Substrate Light', theme: substrateLightTheme }
  ],
  provider: ThemeProvider
};

function loadStories () {
  req.keys().forEach(req);
}

addDecorator(withThemePlayground(options));

configure(loadStories, module);
