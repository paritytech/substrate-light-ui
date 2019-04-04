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

export interface AlertStore {
  readonly alerts: Alert[];
  enqueue (newItem: Alert): void;
  dequeue (): void;
}

/**
 * Add element to end of queue.
 */
function enqueue<T> (queue: T[], newItem: T) {
  return queue.concat(newItem);
}

/**
 * Remove first element of queue.
 */
function dequeue<T> (queue: T[]) {
  return queue.slice(1);
}

export function initStore () {
  let alerts: Alert[] = [];

  return ({
    get alerts () {
      return alerts;
    },

    enqueue (newItem: Alert) {
      alerts = enqueue(alerts, newItem);
    },

    dequeue () {
      alerts = dequeue(alerts);
    }
  }) as AlertStore;
}
