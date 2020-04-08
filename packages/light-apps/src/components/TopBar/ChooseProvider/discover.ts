// Copyright 2018-2020 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { WsProvider } from '@polkadot/api';
import { ProviderMeta } from '@polkadot/extension-inject/types';
import { ProviderInterface } from '@polkadot/rpc-provider/types';

import { Injected } from '../../context';

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
export const FALLBACK_PROVIDERS: Record<string, LazyProvider> = {
  'westend-WsProvider': {
    description: 'Remote node hosted by W3F',
    id: 'westend-WsProvider',
    network: 'westend',
    node: 'light',
    source: 'fallback',
    start: (): Promise<ProviderInterface> =>
      Promise.resolve(new WsProvider('wss://westend-rpc.polkadot.io')),
    transport: 'WsProvider',
  },
  'kusama-WsProvider': {
    description: 'Remote node hosted by W3F',
    id: 'kusama-WsProvider',
    network: 'kusama',
    node: 'light',
    source: 'fallback',
    start: (): Promise<ProviderInterface> =>
      Promise.resolve(new WsProvider('wss://kusama-rpc.polkadot.io')),
    transport: 'WsProvider',
  },
};

interface ProviderSources {
  injected?: Injected;
}

/**
 * Convert a ProviderMeta from the extension to a LazyProvider used by our
 * ProviderContext.
 */
function toLazyProvider(
  injected: Injected,
  meta: ProviderMeta,
  key: string
): LazyProvider {
  return {
    ...meta,
    description: `${meta.node} node from from ${meta.source} extension`,
    id: `${meta.network}-PostMessageProvider`,
    async start(): Promise<ProviderInterface> {
      await injected.provider.startProvider(key);

      return injected.provider;
    },
  };
}

/**
 * Get all the providers injected by a browser extension.
 *
 * @param injected - The Injected class, injected by the extension.
 */
async function getProvidersFromInjected(
  injected?: Injected
): Promise<Record<string, LazyProvider>> {
  if (injected) {
    const providers = await injected.provider.listProviders();
    return Object.entries(providers).reduce((acc, [key, value]) => {
      const lazyProvider = toLazyProvider(injected, value, key);
      acc[lazyProvider.id] = lazyProvider;

      return acc;
    }, {} as Record<string, LazyProvider>);
  }

  return {};
}

/**
 * Try and find all available providers:
 * - Try and ping localhost:9933 for a local node
 * - Try to find providers from browser extension
 * - Add fallback remote node providers
 *
 * @param additionalSources - Manually put additional sources from where
 * providers can come (e.g. browser extension).
 */
export async function getAllProviders(
  additionalSources: ProviderSources = {}
): Promise<Record<string, LazyProvider>> {
  const [extensionProviders, fallbackProviders] = await Promise.all([
    getProvidersFromInjected(additionalSources.injected),
    Promise.resolve(FALLBACK_PROVIDERS),
  ]);

  return {
    ...fallbackProviders,
    ...extensionProviders,
  };
}

/**
 * Filter out the providers for one particular chain.
 *
 * @param chain - The chain for which we would like to find providers.
 * @param allProviders - The mapping of all the available providers.
 */
export function getAllProvidersForChain(
  chain: string,
  allProviders: Record<string, LazyProvider>
): LazyProvider[] {
  return Object.values(allProviders).filter(({ network }) => network === chain);
}

/**
 * Given a map of available providers, and a chain, find the best provider to
 * use for that chain.
 *
 * @param chain - The chain for which we would like to find providers.
 * @param allProviders - The mapping of all the available providers.
 */
export function discoverChain(
  chain: string,
  allProviders: Record<string, LazyProvider>
): LazyProvider | undefined {
  const providersForChain = getAllProvidersForChain(chain, allProviders);

  // For now, we choose the WsProvider to the remote node
  const wsProvider = providersForChain.find(
    ({ transport }) => transport === 'WsProvider'
  );

  return wsProvider;
}
