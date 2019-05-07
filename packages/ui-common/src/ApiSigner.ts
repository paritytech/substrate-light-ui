// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Signer } from '@polkadot/api/types';
import { IExtrinsic } from '@polkadot/types/types';

export class ApiSigner implements Signer {
  private txCount = 0;

  async sign (extrinsic: IExtrinsic, address: string) {
    console.log('SIGN', extrinsic, address);
    return ++this.txCount;
  }
}
