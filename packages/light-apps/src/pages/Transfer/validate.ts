// Copyright 2018-2020 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import ApiRx from '@polkadot/api/rx';
import { Observable, of } from 'rxjs';
import { mapTo, tap } from 'rxjs/operators';

/**
 * Check if an address is valid, with the current api.
 */
function isAddressValid(api: ApiRx, address: string): boolean {
  try {
    api.createType('Address', address);

    return true;
  } catch (e) {
    return false;
  }
}

export interface UserInput {
  amount: string;
  recipient: string;
  sender: string;
  tip: string;
}

export function validate(input: UserInput, api: ApiRx): Observable<void> {
  return of(input).pipe(
    tap((input) => {
      if (!(input.amount && input.recipient && input.sender)) {
        throw new Error('Please fill in all the fields.');
      }

      if (!isAddressValid(api, input.recipient)) {
        throw new Error('Recipient must be a valid address');
      }

      if (!isAddressValid(api, input.sender)) {
        throw new Error('Sender must be a valid address');
      }
    }),
    mapTo(void undefined)
  );
}
