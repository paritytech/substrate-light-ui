// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';

enum AlertType {
  ERROR,
  INFO,
  SUCCESS,
  WARNING
}

export interface Alert {
  content: React.ReactNode;
  type: AlertType;
}

/**
 * Add element to end of queue.
 */
function enqueue<T> (queue: T[], newItem: T) {
  return queue.concat(newItem);
}

/**
 * Remove last element of queue.
 */
function dequeue<T> (queue: T[]) {
  return queue.slice(0, -1);
}

function dequeueN<T> (queue: T[], n: number): [T, T[]] {
  if (n === ) {
    return [queue];
  }

  return dequeueN(queue, n - 1).concat();
}

function initAlerts () {
  let alerts: Alert[] = [];

  return ({
    get alerts () {
      return alerts;
    },

    add (newItem: Alert) {
      alerts = addToQueue(alerts, newItem);
    },

    removeNth (n: number) {

    }
  });
}
