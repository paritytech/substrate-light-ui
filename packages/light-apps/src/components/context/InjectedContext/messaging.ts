// Copyright 2018-2020 @polkadot/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import {
  SeedLengths,
  SigningRequest,
} from '@polkadot/extension-base/background/types';
import { SendRequest } from '@polkadot/extension-base/page/types';
import { KeypairType } from '@polkadot/util-crypto/types';

// Writing the type of this function is a bit cumbersome
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function messaging(sendMessage: SendRequest) {
  return {
    // Acounts

    createAccountExternal(
      name: string,
      address: string,
      genesisHash: string
    ): Promise<boolean> {
      return sendMessage('pri(accounts.create.external)', {
        address,
        genesisHash,
        name,
      });
    },

    createAccountSuri(
      name: string,
      password: string,
      suri: string,
      type?: KeypairType
    ): Promise<boolean> {
      return sendMessage('pri(accounts.create.suri)', {
        name,
        password,
        suri,
        type,
      });
    },

    createSeed(
      length?: SeedLengths,
      type?: KeypairType
    ): Promise<{ address: string; seed: string }> {
      return sendMessage('pri(seed.create)', { length, type });
    },

    editAccount(address: string, name: string): Promise<boolean> {
      return sendMessage('pri(accounts.edit)', { address, name });
    },

    exportAccount(
      address: string,
      password: string
    ): Promise<{ exportedJson: string }> {
      return sendMessage('pri(accounts.export)', { address, password });
    },

    forgetAccount(address: string): Promise<boolean> {
      return sendMessage('pri(accounts.forget)', { address });
    },

    // Signing

    subscribeSigningRequests(
      cb: (accounts: SigningRequest[]) => void
    ): Promise<boolean> {
      return sendMessage('pri(signing.requests)', null, cb);
    },

    approveSignPassword(id: string, password: string): Promise<boolean> {
      return sendMessage('pri(signing.approve.password)', { id, password });
    },
  };
}
