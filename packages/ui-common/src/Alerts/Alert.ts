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

function addToQueue<T> (state: T[], newItem: T) {
  return state.concat(newItem);
}

function removeNth<T> (state: T[], n: number) {

}
