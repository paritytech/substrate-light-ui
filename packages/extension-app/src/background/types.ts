// Copyright 2019-2020 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { RequestSignatures as RequestSignaturesBase } from '../polkadotjs/background/types';

type KeysWithDefinedValues<T> = {
  [K in keyof T]: T[K] extends undefined ? never : K;
}[keyof T];

type NoUndefinedValues<T> = {
  [K in KeysWithDefinedValues<T>]: T[K];
};

export interface RequestSignatures extends RequestSignaturesBase {
  'pub(rpc.subscribeConnected)': [null, boolean, boolean];
}

export type MessageTypes = keyof RequestSignatures;

// Requests

export type RequestTypes = {
  [MessageType in keyof RequestSignatures]: RequestSignatures[MessageType][0];
};

// Subscriptions

export type SubscriptionMessageTypes = NoUndefinedValues<
  {
    [MessageType in keyof RequestSignatures]: RequestSignatures[MessageType][2];
  }
>;
