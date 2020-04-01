// Copyright 2019-2020 @polkadot/extension-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import {
  AccountJson,
  SeedLengths,
} from '@polkadot/extension-base/background/types';
import { sendMessage } from '@polkadot/extension-base/page';
import { KeypairType } from '@polkadot/util-crypto/types';

export async function editAccount(
  address: string,
  name: string
): Promise<boolean> {
  return sendMessage('pri(accounts.edit)', { address, name });
}

export async function exportAccount(
  address: string,
  password: string
): Promise<{ exportedJson: string }> {
  return sendMessage('pri(accounts.export)', { address, password });
}

export async function forgetAccount(address: string): Promise<boolean> {
  return sendMessage('pri(accounts.forget)', { address });
}

export async function createAccountExternal(
  name: string,
  address: string,
  genesisHash: string
): Promise<boolean> {
  return sendMessage('pri(accounts.create.external)', {
    address,
    genesisHash,
    name,
  });
}

export async function createAccountSuri(
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
}

export async function createSeed(
  length?: SeedLengths,
  type?: KeypairType
): Promise<{ address: string; seed: string }> {
  return sendMessage('pri(seed.create)', { length, type });
}

export async function subscribeAccounts(
  cb: (accounts: AccountJson[]) => void
): Promise<boolean> {
  return sendMessage('pri(accounts.subscribe)', null, cb);
}
