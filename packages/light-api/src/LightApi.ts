// Copyright 2017-2018 @polkadot/light-api authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import ApiRx from '@polkadot/api/rx';
import WsProvider from '@polkadot/rpc-provider/ws';
import { switchMap } from 'rxjs/operators';

import { ReactiveGraph } from './ReactiveGraph';
import * as balances from './srml/balances';

interface LightFunctions {
  [index: string]: any; // TODO Better types here
}

export class LightApi extends ApiRx {
  public graph: ReactiveGraph = new ReactiveGraph();
  public light: LightFunctions;

  constructor (wsProvider?: WsProvider) {
    super(wsProvider);

    this.graph.setNode('rpc.chain.subscribeNewHead', this.rpc.chain.subscribeNewHead());
    this.graph.setNode('query.system.events');
    this.graph.setReactiveEdge('rpc.chain.subscribeNewHead', 'query.system.events', [
      switchMap(() => this.query.system.events())
    ]);

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
