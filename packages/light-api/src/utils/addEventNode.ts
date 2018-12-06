// Copyright 2017-2018 @polkadot/light-api authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { EventRecord } from '@polkadot/types';
import { filter, mergeAll } from 'rxjs/operators';

import { NODES } from '../LightApi';
import { ReactiveGraph } from '../ReactiveGraph';
import { ANY_VALUE } from '../types';

export function filterEvent (section: string, method: string, args: any[]) {
  return function ({ event }: EventRecord) {
    return (
      event.section.toString() === section && event.method.toString() === method
      // FIXME Add filtering based on arguments received
    );
  };
}

export function addEventNode (section: string, method: string, args: any[], graph: ReactiveGraph) {
  const eventNode = `events.${section}.${method}(${args
    .map(value => (value === ANY_VALUE ? 'null' : value))
    .join(',')})`;

  // We don't do anything if this eventNode already exists.
  if (graph.node(eventNode)) {
    return eventNode;
  }

  graph.setNode(eventNode);

  // Add an edge between the `rpc.chain.subscribeNewHead` node and the new
  // event node.
  graph.setReactiveEdge(NODES.EVENTS, eventNode, [
    // Each "event" in `query.system.events` is actually a Vector of
    // EventRecord, we mergeAll here as to have an Observable<EventRecord>.
    mergeAll(),
    // We filter out the relevant events we're listening to.
    filter(filterEvent(section, method, args))
  ]);

  return eventNode;
}
