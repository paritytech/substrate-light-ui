// Copyright 2017-2018 @polkadot/light-api authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import ApiRx from '@polkadot/api/rx';
import { AccountId } from '@polkadot/types';
import { switchMap } from 'rxjs/operators';

import { ReactiveGraph } from '../ReactiveGraph';
import { ANY_VALUE } from '../types';
import { addEventNode } from '../utils/addEventNode';

const SECTION = 'balances';

export function freeBalance (accountId: AccountId, graph: ReactiveGraph, api: ApiRx) {
  // Add 2 event nodes that fire when the Transfer event is fired on the
  // correct account.
  const eventNode1 = addEventNode(SECTION, 'Transfer', [accountId, ANY_VALUE, ANY_VALUE, ANY_VALUE], graph);
  const eventNode2 = addEventNode(SECTION, 'Transfer', [ANY_VALUE, accountId, ANY_VALUE, ANY_VALUE], graph);
  graph.setReactiveEdge('query.system.events', eventNode1);
  graph.setReactiveEdge('query.system.events', eventNode2);

  // Merge the above 2 event nodes.
  const mergedNode = `merge(${eventNode1},${eventNode2})`;
  graph.setNode(mergedNode);
  graph.setReactiveEdge(eventNode1, mergedNode);
  graph.setReactiveEdge(eventNode2, mergedNode);

  // Create a freeBalanceNode from the mergedNode, with a pipe.
  const freeBalanceNode = `query.balances.freeBalance(${accountId})`;
  graph.setNode(freeBalanceNode);
  graph.setReactiveEdge(mergedNode, freeBalanceNode, [switchMap(() => api.query.balances.freeBalance(accountId))]);

  return graph.node(freeBalanceNode);
}
