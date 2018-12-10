// Copyright 2017-2018 @polkadot/light-api authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import ApiRx from '@polkadot/api/rx';
import { AccountId } from '@polkadot/types';
import { switchMap } from 'rxjs/operators';

import { NODES } from '../LightApi';
import { ReactiveGraph } from '../ReactiveGraph';
import { ANY_VALUE } from '../types';
import { addEventNode } from '../utils/addEventNode';

const SECTION = 'balances';

export function transferFee (graph: ReactiveGraph, api: ApiRx) {
  const myNode = `query.${SECTION}.transferFee()`;
  graph.setNode(myNode);
  graph.setEdge(NODES.NEW_HEAD, myNode, [switchMap(() => api.query.balances.transferFee())]);
  graph.calculateNode(myNode);
  return graph.node(myNode);
}

export function freeBalance (accountId: AccountId, graph: ReactiveGraph, api: ApiRx) {
  // Add 2 event nodes that fire when the Transfer event is fired on the
  // correct account.
  const eventNode1 = addEventNode(SECTION, 'Transfer', [accountId, ANY_VALUE, ANY_VALUE, ANY_VALUE], graph);
  const eventNode2 = addEventNode(SECTION, 'Transfer', [ANY_VALUE, accountId, ANY_VALUE, ANY_VALUE], graph);
  graph.setEdge(NODES.EVENTS, eventNode1);
  graph.calculateNode(eventNode1);
  graph.setEdge(NODES.EVENTS, eventNode2);
  graph.calculateNode(eventNode2);

  // Merge the above 2 event nodes, also with the startup node.
  const mergedNode = `merge(startup,${eventNode1},${eventNode2})`;
  graph.setNode(mergedNode);
  graph.setEdge(NODES.STARTUP, mergedNode);
  graph.setEdge(eventNode1, mergedNode);
  graph.setEdge(eventNode2, mergedNode);
  graph.calculateNode(mergedNode);

  // Create a freeBalanceNode from the mergedNode, with a pipe.
  const myNode = `query.${SECTION}.freeBalance(${accountId})`;
  graph.setNode(myNode);
  graph.setEdge(NODES.EVENTS, myNode, [switchMap(() => api.query.balances.freeBalance(accountId))]);
  graph.calculateNode(myNode);

  return graph.node(myNode);
}
