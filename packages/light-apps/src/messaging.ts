// Copyright 2019-2020 @polkadot/extension-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import {
  AccountJson,
  MessageTypes,
  MessageTypesWithNoSubscriptions,
  MessageTypesWithNullRequest,
  MessageTypesWithSubscriptions,
  RequestTypes,
  ResponseTypes,
  SeedLengths,
  SubscriptionMessageTypes,
} from '@polkadot/extension-base/background/types';
import { KeypairType } from '@polkadot/util-crypto/types';

interface Handler {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  resolve: (data: any) => void;
  reject: (error: Error) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  subscriber?: (data: any) => void;
}

type Handlers = Record<string, Handler>;

const handlers: Handlers = {};
let idCounter = 0;

// setup a listener for messages, any incoming resolves the promise
// eslint-disable-next-line @typescript-eslint/no-explicit-any
window.addEventListener('message', (data: any): void => {
  const handler = handlers[data.id];

  if (!handler) {
    console.error(`Unknown response: ${JSON.stringify(data)}`);
    return;
  }

  if (!handler.subscriber) {
    delete handlers[data.id];
  }

  if (data.subscription) {
    (handler.subscriber as Function)(data.subscription);
  } else if (data.error) {
    handler.reject(new Error(data.error));
  } else {
    handler.resolve(data.response);
  }
});

function sendMessage<TMessageType extends MessageTypesWithNullRequest>(
  message: TMessageType
): Promise<ResponseTypes[TMessageType]>;
function sendMessage<TMessageType extends MessageTypesWithNoSubscriptions>(
  message: TMessageType,
  request: RequestTypes[TMessageType]
): Promise<ResponseTypes[TMessageType]>;
function sendMessage<TMessageType extends MessageTypesWithSubscriptions>(
  message: TMessageType,
  request: RequestTypes[TMessageType],
  subscriber: (data: SubscriptionMessageTypes[TMessageType]) => void
): Promise<ResponseTypes[TMessageType]>;
function sendMessage<TMessageType extends MessageTypes>(
  message: TMessageType,
  request?: RequestTypes[TMessageType],
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  subscriber?: (data: any) => void
): Promise<ResponseTypes[TMessageType]> {
  return new Promise((resolve, reject): void => {
    const id = `${Date.now()}.${++idCounter}`;

    handlers[id] = { resolve, reject, subscriber };

    window.postMessage({ id, message, request: request || {} }, '*');
  });
}

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
