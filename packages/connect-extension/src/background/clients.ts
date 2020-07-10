// Copyright 2019-2020 @polkadot/extension authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

/* eslint-disable @typescript-eslint/camelcase */

import { ProviderMeta } from '@polkadot/extension-inject/types';
import { ProviderInterface } from '@polkadot/rpc-provider/types';
import {
  kusama_cc3,
  LightClient,
  WasmProvider,
  westend,
} from '@substrate/light';

// We bundled the .wasm file inside the extension, at this relative url. See
// the structure of the output `build/` folder.
export const KUSAMA_CC3_WASM = './wasm/kusama_cc3.wasm';

type Providers = Record<
  string,
  {
    meta: ProviderMeta;
    // The provider is not running at init, calling this will instantiate the
    // provider.
    start: () => ProviderInterface;
  }
>;

/**
 * All light clients exposed by the extension.
 */
const lightClients: Record<string, LightClient> = {
  kusama_cc3: kusama_cc3.fromUrl(KUSAMA_CC3_WASM),
  westend: westend.fromUrl(KUSAMA_CC3_WASM),
};

/**
 * Map of all providers exposed by the extension.
 */
export const providerList: Providers = Object.entries(lightClients).reduce(
  (acc, [key, value]) => {
    acc[key] = {
      meta: {
        network: value.network,
        node: 'light',
        source: 'slui',
        transport: 'WasmProvider',
      },
      start(): ProviderInterface {
        return new WasmProvider(value);
      },
    };

    return acc;
  },
  {} as Providers
);
