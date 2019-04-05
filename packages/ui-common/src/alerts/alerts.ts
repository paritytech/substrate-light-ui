// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';

export type AlertType = 'error' | 'info' | 'success' | 'warning';

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
export function enqueue<T> (queue: T[], newItem: T) {
  return queue.concat(newItem);
}

/**
 * Remove first element of queue.
 */
export function dequeue<T> (queue: T[]) {
  return queue.slice(1);
}
