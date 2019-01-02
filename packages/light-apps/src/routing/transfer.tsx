// Copyright 2017-2018 @polkadot/light-apps authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Route } from '../types';

import { Transfer } from '@polkadot/transfer-app';

export const transfer: Route = {
  Component: Transfer,
  icon: 'angle double right',
  isApiGated: true,
  isHidden: false,
  name: 'Transfer'
};
