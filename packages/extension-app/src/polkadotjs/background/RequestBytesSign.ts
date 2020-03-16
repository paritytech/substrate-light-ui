// Copyright 2019-2020 @polkadot/extension authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { KeyringPair } from '@polkadot/keyring/types';
import { TypeRegistry } from '@polkadot/types';
import { SignerPayloadJSON, SignerPayloadRaw } from '@polkadot/types/types';
import { hexToU8a, u8aToHex } from '@polkadot/util';

import { RequestSign } from './types';

export default class RequestBytesSign implements RequestSign {
  public readonly inner: SignerPayloadJSON | SignerPayloadRaw;

  constructor(inner: SignerPayloadRaw) {
    this.inner = inner;
  }

  sign(_registry: TypeRegistry, pair: KeyringPair): { signature: string } {
    const inner = this.inner as SignerPayloadRaw;
    const signedBytes = pair.sign(hexToU8a(inner.data));

    return {
      signature: u8aToHex(signedBytes),
    };
  }
}
