// Copyright 2018-2020 @polkadot/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { SeedLengths } from '@polkadot/extension-base/background/types';
import { KeypairType } from '@polkadot/util-crypto/types';

import { sendMessage } from './sendMessage';

export function editAccount(address: string, name: string): Promise<boolean> {
  return sendMessage('pri(accounts.edit)', { address, name });
}

export function exportAccount(
  address: string,
  password: string
): Promise<{ exportedJson: string }> {
  return sendMessage('pri(accounts.export)', { address, password });
}

export function forgetAccount(address: string): Promise<boolean> {
  return sendMessage('pri(accounts.forget)', { address });
}

export function createAccountExternal(
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

export function createAccountSuri(
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

export function createSeed(
  length?: SeedLengths,
  type?: KeypairType
): Promise<{ address: string; seed: string }> {
  return sendMessage('pri(seed.create)', { length, type });
}
