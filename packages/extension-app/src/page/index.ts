// Copyright 2019-2020 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

/**
 * Script to inject to the host webpage.
 * This file is only injected in http://localhost:3000 (see `content/`)
 */

import { injectExtension } from '@polkadot/extension-inject';
import { Injected } from '@polkadot/extension-inject/types';

import pkgJson from '../../package.json';

function enableFn(): Promise<Injected> {
  return Promise.reject(new Error('Unimplemented'));
}

injectExtension(enableFn, { name: 'slui', version: pkgJson.version });
