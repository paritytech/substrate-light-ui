// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Identity } from '@polkadot/identity-app';

import { Route } from '../types';

export const identity: Route = {
  Component: Identity,
  icon: 'users',
  name: 'Identity',
  path: '/Identity'
};
