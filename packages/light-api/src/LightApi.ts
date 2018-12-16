// Copyright 2017-2018 @polkadot/light-api authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ApiOptions } from '@polkadot/api/types';
import { ProviderInterface } from '@polkadot/rpc-provider/types';
import ApiRx from '@polkadot/api/rx';
import { of } from 'rxjs';
import { mergeAll, switchMap } from 'rxjs/operators';

import { ReactiveGraph } from './ReactiveGraph';
import * as balances from './srml/balances';

interface LightFunctions {
  [index: string]: any; // TODO Better types here
}

// Some important nodes in the Graph
export const NODES = {
  EVENTS: 'query.system.events',
  NEW_HEAD: 'rpc.chain.subscribeNewHead',
  STARTUP: 'startup'
};

export class LightApi extends ApiRx {
  public graph: ReactiveGraph = new ReactiveGraph();
  public light: LightFunctions;

  constructor (options?: ApiOptions | ProviderInterface | undefined) {
    super(options);

    // Add basic source nodes
    this.graph.setNode(NODES.STARTUP, of(1));
    this.graph.setNode(NODES.NEW_HEAD, this.rpc.chain.subscribeNewHead());

    // Add events node
    this.graph.setNode(NODES.EVENTS);
    this.graph.setEdge(NODES.NEW_HEAD, NODES.EVENTS, [
      switchMap(() => this.query.system.events()),
      // Each "event" in `query.system.events` is actually a Vector of
      // EventRecord, we mergeAll here as to have an Observable<EventRecord>.
      mergeAll()
    ]);
    this.graph.calculateNode(NODES.EVENTS);

    this.light = Object.keys(balances).reduce(
      (result, key) => {
        // @ts-ignore
        result[key] = (...args: any[]) => balances[key](...args, this.graph, this);

        return result;
      },
      {} as LightFunctions
    );
  }
}
