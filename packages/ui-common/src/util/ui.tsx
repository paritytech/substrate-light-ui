// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';

/**
 * A handler for HTML click/change/input events
 * @example
 * ```typescript
 * const handleChangeName = handler(setName);
 *
 * <Input onChange={handleChangeName} />;
 * ```
 */
export function handler (setter: React.Dispatch<React.SetStateAction<string>>) {
  return function ({ target: { value } }: React.ChangeEvent<HTMLInputElement>): void {
    setter(value);
  };
}
