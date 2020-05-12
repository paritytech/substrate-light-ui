// Copyright 2018-2020 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

/* eslint-disable @typescript-eslint/camelcase */

import { WsProvider } from '@polkadot/api';
import { ProviderMeta } from '@polkadot/extension-inject/types';
import { ProviderInterface } from '@polkadot/rpc-provider/types';
import { kusama_cc3, WasmProvider, westend } from '@substrate/light';

import { detectEnvironment } from '../../../util/env';
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
 * The URL to the WASM blob of the light client. In this project, we put it in
 * the `public` folder so that it's statically available.
 */
const WASM_BLOB_URL = './kusama_cc3.wasm';

/**
 * These are the WASM providers that the user can run directly inside the
 * browser tab. They are only available in `TAB_ENV`. Note that we made sure to
 * copy the WASM blob inside
 */
export const TAB_WASM_PROVIDERS: Record<string, LazyProvider> = {
  'Kusama-tab-WasmProvider': {
    description: 'In-tab WASM light client',
    id: 'Kusama-tab-WasmProvider',
    network: 'Kusama',
    node: 'light',
    source: 'tab',
    start: (): Promise<ProviderInterface> =>
      Promise.resolve(new WasmProvider(kusama_cc3.fromUrl(WASM_BLOB_URL))),
    transport: 'WasmProvider',
  },
  'Westend-tab-WasmProvider': {
    description: 'In-tab WASM light client',
    id: 'Westend-tab-WasmProvider',
    network: 'Westend',
    node: 'light',
    source: 'tab',
    start: (): Promise<ProviderInterface> =>
      Promise.resolve(new WasmProvider(westend.fromUrl(WASM_BLOB_URL))),
    transport: 'WasmProvider',
  },
};

/**
 * These fallback providers connect to a centralized remote RPC node.
 */
export const FALLBACK_PROVIDERS: Record<string, LazyProvider> = {
  'Kusama-remote-WsProvider': {
    description: 'Remote node hosted by W3F',
    id: 'Kusama-remote-WsProvider',
    network: 'Kusama',
    node: 'light',
    source: 'remote',
    start: (): Promise<ProviderInterface> =>
      Promise.resolve(new WsProvider('wss://kusama-rpc.polkadot.io')),
    transport: 'WsProvider',
  },
  'Westend-remote-WsProvider': {
    description: 'Remote node hosted by W3F',
    id: 'Westend-remote-WsProvider',
    network: 'Westend',
    node: 'light',
    source: 'remote',
    start: (): Promise<ProviderInterface> =>
      Promise.resolve(new WsProvider('wss://westend-rpc.polkadot.io')),
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
    id: `${meta.network}-${meta.source}-PostMessageProvider`,
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
 * Local nodes expose this WS endpoint.
 */
const LOCAL_WS_ENDPOINT = 'ws://127.0.0.1:9944';

/**
 * Check if a local node is running; if yes, return a provider to this node. If
 * no, then return an empty object.
 */
async function getLocalProvider(): Promise<Record<string, LazyProvider>> {
  try {
    const provider = new WsProvider(LOCAL_WS_ENDPOINT);

    const chain = await Promise.race([
      provider.send('system_chain', []),
      // Timeout the `.send` after 2s.
      new Promise((_resolve, reject) => setTimeout(reject, 2000)),
    ]);

    provider.disconnect();

    return {
      [`${chain}-local-WsProvider`]: {
        id: `${chain}-local-WsProvider`,
        description: 'Local node at 127.0.0.1:9944',
        network: chain,
        node: 'light',
        source: 'local',
        start: (): Promise<WsProvider> =>
          Promise.resolve(new WsProvider(LOCAL_WS_ENDPOINT)),
        transport: 'WsProvider',
      },
    };
  } catch {
    return {};
  }
}

/**
 * Try and find all available providers:
 * - Try and ping localhost:9933 for a local node (getLocalProvider).
 * - Try to find providers from browser extension (getProvidersFromInjected).
 * - Add fallback remote node providers.
 *
 * @param injectedSources - Sources from where providers can come (e.g. browser
 * extension).
 */
export async function getAllProviders(
  injectedSources: ProviderSources = {}
): Promise<Record<string, LazyProvider>> {
  const [extensionProviders, localProviders] = await Promise.all([
    getProvidersFromInjected(injectedSources.injected),
    getLocalProvider(),
  ]);

  const isTabEnv = detectEnvironment() === 'TAB_ENV';

  return {
    // Only add tab WASM providers if we're in a browser tab
    ...(isTabEnv ? TAB_WASM_PROVIDERS : {}),
    ...FALLBACK_PROVIDERS,
    ...extensionProviders,
    ...localProviders,
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

  // For now, the algorithm is:
  // - If there's a local node, use it.
  // - If not, use the remote node hosted by W3F.
  //
  // We don't use WASM nodes by default for now, because they are still
  // slightly cumbersome to use. Users need to manually choose a WASM node from
  // the UI to use it.
  const localProvider = providersForChain.find(
    ({ source }) => source === 'local'
  );
  const wsProvider = providersForChain.find(
    ({ source, transport }) => source === 'remote' && transport === 'WsProvider'
  );

  return localProvider || wsProvider;
}
