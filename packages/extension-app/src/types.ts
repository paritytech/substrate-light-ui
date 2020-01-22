// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.;

export interface WasmClient {
  free(): void;
  rpcSend(rpc: string): Promise<string>;
  rpcSubscribe(rpc: string, callback: any): Promise<string>;
}

export type MessageTypes = keyof PayloadTypes;

export interface TransportRequestMessage<TMessageType extends MessageTypes> {
  id: number;
  message: TMessageType;
  origin: 'SLUI';
  request: PayloadTypes[TMessageType] | null;
}

export interface PayloadTypes {
  'rpc.send': MessageRpcSend;
  'rpc.sendSubscribe': MessageRpcSendSubscribe;
}

type IsNull<T, K extends keyof T> = { [K1 in Exclude<keyof T, K>]: T[K1] } & T[K] extends null ? K : never;
type NullKeys<T> = { [K in keyof T]: IsNull<T, K> }[keyof T];
export type NullMessageTypes = NullKeys<PayloadTypes>;

export interface MessageAuthorize {
  origin: string;
}

export interface MessageAuthorizeApprove {
  id: string;
}

export interface MessageAuthorizeReject {
  id: string;
}

export type MessageAuthorizeRequests = null;

export type MessageAuthorizeSubscribe = null;

export interface MessageAccountEdit {
  address: string;
  name: string;
}

export interface MessageAccountForget {
  address: string;
}

export type MessageAccountList = null;

export type MessageAccountSubscribe = null;

export interface MessageExtrinsicSignApprove {
  id: string;
  password: string;
}

export interface MessageExtrinsicSignCancel {
  id: string;
}

export type MessageExtrinsicSignRequests = null;

export type MessageExtrinsicSignSubscribe = null;

export interface MessageRpcSend {
  method: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  params?: any[];
}

export interface MessageRpcSendSubscribe {
  type: string;
  method: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  params?: any[];
}

// Responses

interface NonNullResponseTypes {
  'rpc.send': MessageRpcSendResponse;
  'rpc.sendSubscribe': MessageRpcSendResponse;
}

export type ResponseTypes = {
  [K in Exclude<MessageTypes, keyof NonNullResponseTypes>]: null;
} &
  NonNullResponseTypes;

export interface TransportSubscriptionNotification {
  subscriptionId: string;
  type: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  result?: any;
}

export interface TransportResponseMessage<TMessage extends ResponseMessage> {
  error?: string;
  id: string;
  result?: TMessage;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  subscription?: any;
}

export type ResponseMessage = MessageExtrinsicSignResponse | MessageSeedCreateResponse | MessageSeedValidateResponse;

export interface MessageExtrinsicSignResponse {
  id: string;
  signature: string;
}

export interface MessageSeedCreateResponse {
  address: string;
  seed: string;
}

export interface MessageSeedValidateResponse {
  address: string;
  suri: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type MessageRpcSendResponse = any;

export interface SendRequest {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  <TMessageType extends MessageTypes>(
    message: TMessageType,
    request?: PayloadTypes[TMessageType],
    subscriber?: (data: any) => void
  ): Promise<ResponseTypes[TMessageType]>;
}
export type AnyJSON = string | number | boolean | null | { [property: string]: AnyJSON } | AnyJSON[];
