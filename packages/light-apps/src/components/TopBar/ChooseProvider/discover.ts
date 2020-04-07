// Copyright 2018-2020 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { WsProvider } from '@polkadot/api';
import { ProviderMeta } from '@polkadot/extension-inject/types';
import { ProviderInterface } from '@polkadot/rpc-provider/types';

/**
 * Interface describing a Provider, lazily loaded.
 */
export interface LazyProvider extends ProviderMeta {
  description: string;
  id: string;
  start: () => Promise<ProviderInterface>;
}

/**
 * These fallback providers connect to a centralized remote RPC node.
 */
export const FALLBACK_PROVIDERS: LazyProvider[] = [
  {
    description: 'Remote node hosted by W3F',
    id: 'westend-WsProvider',
    network: 'westend',
    node: 'light',
    source: 'slui',
    start: (): Promise<ProviderInterface> =>
      Promise.resolve(new WsProvider('wss://westend-rpc.polkadot.io')),
    transport: 'WsProvider',
  },
  {
    description: 'Remote node hosted by W3F',
    id: 'kusama-WsProvider',
    network: 'kusama',
    node: 'light',
    source: 'slui',
    start: (): Promise<ProviderInterface> =>
      Promise.resolve(new WsProvider('wss://kusama-rpc.polkadot.io')),
    transport: 'WsProvider',
  },
];
