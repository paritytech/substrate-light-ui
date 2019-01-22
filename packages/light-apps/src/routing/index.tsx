// Copyright 2017-2018 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { identity } from './identity';
import { transfer } from './transfer';
import { Routing } from '../types';

const routes = [identity, transfer];

export const routing = {
  default: identity,
  routes
} as Routing;
