// Copyright 2017-2018 @polkadot/light-api authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import ApiRx from '@polkadot/api/rx';
import { AccountId, EventRecord } from '@polkadot/types';
import { filter, switchMap } from 'rxjs/operators';

import { ReactiveGraph } from '../ReactiveGraph';
import { ANY_VALUE } from '../types';
import { filterEvent } from '../utils/addEventNode';

const SECTION = 'balances';

export function freeBalance (accountId: AccountId, graph: ReactiveGraph, api: ApiRx) {
  // Filter the relevant Transfers
  const filterTransfers = (eventRecord: EventRecord) => {
    return (
      filterEvent(SECTION, 'Transfer', [accountId, ANY_VALUE, ANY_VALUE, ANY_VALUE])(eventRecord) ||
      filterEvent(SECTION, 'Transfer', [ANY_VALUE, accountId, ANY_VALUE, ANY_VALUE])(eventRecord)
    );
  };

  // Create a freeBalanceNode from the `query.system.events` node, with pipes.
  const freeBalanceNode = `query.balances.freeBalance(${accountId})`;
  graph.setNode(freeBalanceNode);
  graph.setReactiveEdge('query.system.events', freeBalanceNode, [
    filter(filterTransfers),
    switchMap(() => api.query.balances.freeBalance(accountId))
  ]);

  return graph.node(freeBalanceNode);
}
