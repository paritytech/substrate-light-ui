// Copyright 2017-2018 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { RpcRxInterface } from '@polkadot/rpc-rx/types';

export type BaseContext = {
  api: RpcRxInterface,
  // TODO: Set the correct type
  router: {
    route: {
      location: Location
    }
  }
};

export type BitLength = 8 | 16 | 32 | 64 | 128 | 256;
