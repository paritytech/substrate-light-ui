// Copyright 2017-2018 @polkadot/light-apps authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Routing, Routes } from '../types';

import identity from './identity';
import transfer from './transfer';

const routes: Routes = ([] as Routes).concat(
                          identity,
                          transfer
                       );

export default ({
  default: 'Identity',
  routes
} as Routing);
