// Copyright 2017-2018 @polkadot/light-api authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import ApiRx from '@polkadot/api/rx';
import { switchMap } from 'rxjs/operators';

import { NODES } from '../LightApi';
import { ReactiveGraph } from '../ReactiveGraph';

const SECTION = 'timestamp';

export function blockPeriod (graph: ReactiveGraph, api: ApiRx) {
  const myNode = `query.${SECTION}.blockPeriod()`;
  graph.setNode(myNode);
  graph.setEdge(NODES.NEW_HEAD, myNode, [switchMap(() => api.query.timestamp.blockPeriod())]);
  graph.calculateNode(myNode);
  return graph.node(myNode);
}
