// Copyright 2017-2018 @polkadot/light-api authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import ApiRx from '@polkadot/api/rx';
import { Address } from '@polkadot/types';
import { concat, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { onNewHead, onTransfer } from './frequency';

export function balanceOf (address: Address, api: ApiRx) {
  return concat([of(1), onTransfer(address, api)]).pipe(switchMap(() => api.query.balances.freeBalance(address)));
}

export function newHead (api: ApiRx) {
  return onNewHead(api);
}
