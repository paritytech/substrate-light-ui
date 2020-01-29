// Copyright 2018-2020 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ProviderInterface } from '@polkadot/rpc-provider/types';
import { Observable } from 'rxjs';

/**
 * Create an Observable for whether a provider is connected or not
 *
 * @param provider - The provider to track
 */
export function providerConnected(provider: ProviderInterface): Observable<boolean> {
  return new Observable(subscriber => {
    if (provider.isConnected()) {
      subscriber.next(true);
    } else {
      subscriber.next(false);
    }

    provider.on('connected', () => {
      subscriber.next(true);
    });

    provider.on('disconnected', () => {
      subscriber.next(false);
    });
  });
}
