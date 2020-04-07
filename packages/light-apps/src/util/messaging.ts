// Copyright 2018-2020 @polkadot/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import {
  SeedLengths,
  SigningRequest,
} from '@polkadot/extension-base/background/types';
import { SendRequest } from '@polkadot/extension-base/page/types';
import { KeypairType } from '@polkadot/util-crypto/types';

// Accounts

export function editAccount(
  sendMessage: SendRequest,
  address: string,
  name: string
): Promise<boolean> {
  return sendMessage('pri(accounts.edit)', { address, name });
}

export function exportAccount(
  sendMessage: SendRequest,
  address: string,
  password: string
): Promise<{ exportedJson: string }> {
  return sendMessage('pri(accounts.export)', { address, password });
}

export function forgetAccount(
  sendMessage: SendRequest,
  address: string
): Promise<boolean> {
  return sendMessage('pri(accounts.forget)', { address });
}

export function createAccountExternal(
  sendMessage: SendRequest,
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
  sendMessage: SendRequest,
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
  sendMessage: SendRequest,
  length?: SeedLengths,
  type?: KeypairType
): Promise<{ address: string; seed: string }> {
  return sendMessage('pri(seed.create)', { length, type });
}

// Signing

export async function subscribeSigningRequests(
  sendMessage: SendRequest,
  cb: (accounts: SigningRequest[]) => void
): Promise<boolean> {
  return sendMessage('pri(signing.requests)', null, cb);
}

export async function approveSignPassword(
  sendMessage: SendRequest,
  id: string,
  password: string
): Promise<boolean> {
  return sendMessage('pri(signing.approve.password)', { id, password });
}
