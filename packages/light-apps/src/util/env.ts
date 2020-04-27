// Copyright 2018-2020 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import extension from '@polkadot/extension-inject/chrome';

const ELECTRON_ENV = 'ELECTRON_ENV';
const POPUP_ENV = 'POPUP_ENV';
const TAB_ENV = 'TAB_ENV';

/**
 * Different types of environment.
 */
export type Env = typeof ELECTRON_ENV | typeof POPUP_ENV | typeof TAB_ENV;

/**
 * Detect whether light-apps is running in Electron, in an Extension popup, or
 * as a regular browser webpage tab.
 */
export function detectEnvironment(): Env {
  // Detect ELECTRON_ENV
  // https://github.com/electron/electron/issues/2288#issuecomment-337858978
  const userAgent = navigator.userAgent.toLowerCase();
  if (userAgent.includes(' electron/')) {
    return ELECTRON_ENV;
  }

  // Detect POPUP_ENV
  // Chrome extensions have the global `chrome` object, Firefox have the
  // `browser` one (WebExtension). These are all detected in
  // `@polkadot/extension-inject`.
  if (extension) {
    return POPUP_ENV;
  }

  return TAB_ENV;
}
