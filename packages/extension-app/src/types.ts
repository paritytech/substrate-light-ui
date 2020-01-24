// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.;

export interface WasmClient {
  free(): void;
  rpcSend(rpc: string): Promise<string>;
  rpcSubscribe(rpc: string, callback: (res: string) => void): void;
}
