// Copyright 2017-2018 @polkadot/light-api authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Graph } from '@dagrejs/graphlib';
import { assert } from '@polkadot/util';
import { merge } from 'rxjs';

export class ReactiveGraph extends Graph {
  setReactiveEdge (v: string, w: string, label: any = [], name?: string): ReactiveGraph {
    this.setEdge(v, w, label, name);

    // Get all incoming edges into w
    const edges = this.inEdges(w);

    if (!edges) {
      throw new Error(`Incoming edges into ${w} are empty.`);
    }

    // Perform some basic checks
    edges.forEach(edge => {
      assert(
        this.node(edge.v).subscribe, // FIXME should be isObservable here
        `Node ${edge.v} is not an Observable, got ${JSON.stringify(this.node(edge.v))}.`
      );
      assert(
        Array.isArray(this.edge(edge.v, edge.w)),
        `Edge ${edge.name} is not a pipes array, got ${JSON.stringify(this.edge(edge.v, edge.w))}.`
      );
    });

    // The Observable inside node w is done by merging the Observables incoming
    // into w, where each Observable is piped into the pipes inside their edge
    // with w.
    const wObservable = merge(...edges.map(edge => this.node(edge.v).pipe(...this.edge(v, w))));

    this.setNode(w, wObservable);

    return this;
  }
}
