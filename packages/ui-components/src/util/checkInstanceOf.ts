// Copyright 2018-2020 @paritytech/Lichen authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';
import { SingleAddress } from '@polkadot/ui-keyring/observable/types';

export function isInstanceOfSingleAddress(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  object: any
): object is SingleAddress {
  // very loose check
  return 'json' in object && 'option' in object;
}

export function isInstanceOfInjectedExtension(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  object: any
): object is InjectedAccountWithMeta {
  return 'meta' in object && 'address' in object;
}
