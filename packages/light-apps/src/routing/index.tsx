// Copyright 2017-2018 @polkadot/light-apps authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Routing, Routes } from '../types';

import accountManagement from './accountManagement';
import governance from './governance';
// import transfer from './transfer';

const routes: Routes = ([] as Routes).concat(
                          accountManagement,
                          governance
                          // transfer
                       );

export default ({
  default: 'accountManagement',
  routes
} as Routing);
