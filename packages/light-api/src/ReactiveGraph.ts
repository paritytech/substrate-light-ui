// Copyright 2017-2018 @polkadot/light-api authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Graph } from '@dagrejs/graphlib';
import { assert } from '@polkadot/util';
import { merge } from 'rxjs';

export class ReactiveGraph extends Graph {
  calculateNode (name: string) {
    // Get all incoming edges into w
    const edges = this.inEdges(name);

    if (!edges) {
      throw new Error(`Incoming edges into ${name} are empty.`);
    }

    // Perform some basic checks
    edges.forEach(edge => {
      assert(
        this.node(edge.v).subscribe, // FIXME should be isObservable here
        `Node ${edge.v} is not an Observable, got ${JSON.stringify(this.node(edge.v))}.`
      );
      assert(
        Array.isArray(this.edge(edge.v, name)), // FIXME do a more precise check
        `Edge ${name} is not a pipes array, got ${JSON.stringify(this.edge(edge.v, name))}.`
      );
    });

    // The Observable inside node w is done by merging the Observables incoming
    // into w, where each Observable is piped into the pipes inside their edge
    // with w.
    const wObservable = merge(...edges.map(edge => this.node(edge.v).pipe(...this.edge(edge))));

    this.setNode(name, wObservable);
  }
}
