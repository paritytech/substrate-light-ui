// Copyright 2017-2018 @polkadot/light-api authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import ApiRx from '@polkadot/api/rx';
import { AccountId, EventRecord } from '@polkadot/types';
import { filter, switchMap } from 'rxjs/operators';

import { LightDepGraph } from '../types';

const SECTION = 'balances';

export function freeBalance (accountId: AccountId, depGraph: LightDepGraph, api: ApiRx) {
  depGraph.addNode('events.balances.Transfer(accountId,null,null,null)', [
    filter(({ event, phase }: EventRecord) => {
      return phase.value && event.section === SECTION && event.method === 'Transfer';
    })
  ]);
  depGraph.addNode('events.balances.Transfer(null,accountId,null,null)', [
    filter(({ event, phase }: EventRecord) => {
      return phase.value && event.section === SECTION && event.method === 'Transfer';
    })
  ]);
  depGraph.addDependency('query.system.events', 'events.balances.Transfer(accountId,null,null,null)');
  depGraph.addDependency('query.system.events', 'events.balances.Transfer(null,accountId,null,null)');

  depGraph.addNode('query.balances.freeBalance(accountId)', [
    switchMap(() => api.query.balances.freeBalance(accountId))
  ]);
}
