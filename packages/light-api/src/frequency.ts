// Copyright 2017-2018 @polkadot/light-api authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import ApiRx from '@polkadot/api/rx';

/**
 * @description Observable that fires on each new block.
 * @param api - The Api object which makes the underlying calls.
 */
export function onNewHead (api: ApiRx) {
  return api.rpc.chain.subscribeNewHead();
}
