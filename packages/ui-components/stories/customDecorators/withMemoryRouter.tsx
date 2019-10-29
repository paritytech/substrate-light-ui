// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import { MemoryRouter } from 'react-router-dom';

export const withMemoryRouter = (storyFn: any): React.ReactElement => (
  <MemoryRouter>{storyFn()}</MemoryRouter>
);
