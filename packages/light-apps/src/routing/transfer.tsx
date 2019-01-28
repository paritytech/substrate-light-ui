// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Transfer } from '@polkadot/transfer-app';

import { Route } from '../types';

export const transfer: Route = {
  Component: Transfer,
  icon: 'angle double right',
  name: 'Transfer',
  path: '/Transfer'
};
