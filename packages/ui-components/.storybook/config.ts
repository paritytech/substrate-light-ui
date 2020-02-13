// Copyright 2018-2020 @paritytech/Nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import 'semantic-ui-css/semantic.min.css';
import { configure } from '@storybook/react';

const req = require.context('../stories', true, /.stories.tsx$/);

function loadStories () {
  req.keys().forEach(req);
}

configure(loadStories, module);
