// Copyright 2017-2018 @polkadot/light-api authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import ApiRx from '@polkadot/api/rx';

import { onNewHead } from './frequency';

export function newHead (api: ApiRx) {
  return onNewHead(api);
}
