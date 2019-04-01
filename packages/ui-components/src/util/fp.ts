// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

// These functions are utilities missing from https://github.com/gcanti/fp-ts
// FIXME This file should **NOT** go inside ui-components, but where?

import { curry } from 'fp-ts/lib/function';

/**
 * Returns a function that when supplied an object returns the indicated property of that object, if it exists.
 */
export function prop<P extends keyof T, T> (p: P, obj: T): T[P] {
  return obj[p];
}

function propCurried<P extends keyof T, T> (...args) {
  curry<P, T, T[P]>(prop);
}
