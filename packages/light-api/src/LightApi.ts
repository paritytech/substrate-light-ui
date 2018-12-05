// Copyright 2017-2018 @polkadot/light-api authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import ApiRx from '@polkadot/api/rx';
import WsProvider from '@polkadot/rpc-provider/ws';
import { DepGraph } from 'dependency-graph';
import { switchMap } from 'rxjs/operators';

import * as balances from './srml/balances';
import { LightDepGraph } from './types';

export class LightApi extends ApiRx {
  private depGraph: LightDepGraph;
  // public light: LightFunctions;

  constructor (wsProvider?: WsProvider) {
    super(wsProvider);

    this.depGraph = new DepGraph();

    this.depGraph.addNode('rpc.chain.subscribeNewHead', []);
    this.depGraph.addNode('query.system.events', [switchMap(() => this.query.system.events())]);
    this.depGraph.addDependency('rpc.chain.subscribeNewHead', 'query.system.events');
  }
}
