// Copyright 2018-2020 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import StateBase from '@polkadot/extension-base/background/handlers/State';
import { PORT_EXTENSION } from '@polkadot/extension-base/defaults';
import { assert } from '@polkadot/util';

/**
 * This is a copy-paste from @polkadot/extension-base/background/handlers/State
 * State.stripUrl.
 */
function stripUrl(url: string): string {
  assert(
    url && (url.startsWith('http:') || url.startsWith('https:')),
    `Invalid url ${url}, expected to start with http: or https:`
  );

  const parts = url.split('/');

  return parts[2];
}

/**
 * This is our logic to determine who we should allow.
 * @param url - The url to check.
 */
function checkUrl(url: string): boolean {
  // Since we don't differentiate here between Tab and Extension, we need to
  // specifically allow Extension.
  if (url === PORT_EXTENSION) {
    return true;
  }

  const stripped = stripUrl(url);

  // FIXME do this while we don't have an auth page in the UI, so we only allow
  // known domains.
  if (stripped === 'localhost:3000') {
    return true;
  }

  return false;
}

export class State extends StateBase {
  // Override with our custom URL authorization.
  public authorizeUrl(url: string): Promise<boolean> {
    return Promise.resolve(checkUrl(url));
  }

  // Override with our custom URL authorization.
  public ensureUrlAuthorized = checkUrl;
}
