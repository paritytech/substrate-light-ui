// Copyright 2018-2020 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Header, Health } from '@polkadot/types/interfaces';
import { logger } from '@polkadot/util';
import { Loading } from '@substrate/ui-components';
import React, { useContext } from 'react';

import { HealthContext } from './HealthContext';

const STATUS_DISPLAY_GOOD = 0;
const STATUS_DISPLAY_WARN = 1;
const STATUS_DISPLAY_ERROR = 2;

export type STATUS_DISPLAY_CODE =
  | typeof STATUS_DISPLAY_GOOD // All good (green)
  | typeof STATUS_DISPLAY_WARN // Warning (yellow)
  | typeof STATUS_DISPLAY_ERROR; // Error (red)

export interface StatusDisplay {
  code: STATUS_DISPLAY_CODE;
  message?: string;
}

const l = logger('health');

/**
 *
 * @param header - The latest header of the light node
 * @param health
 */
export function displayStatus(header?: Header, health?: Health): StatusDisplay {
  if (!health) {
    return {
      code: STATUS_DISPLAY_ERROR,
      message: 'Connecting to node...',
    };
  }

  if (health.peers.eqn(0)) {
    return {
      code: STATUS_DISPLAY_ERROR,
      message: 'Finding peers on the network...',
    };
  }

  if (!header) {
    return {
      code: STATUS_DISPLAY_ERROR,
      message: 'Preparing to sync...',
    };
  }

  if (health.isSyncing.isTrue) {
    return {
      code: STATUS_WARN,
      message: `Syncing #${header.number}...`,
    };
  }

  return {
    code: STATUS_GOOD,
  };
}

/**
 * A gate that shows a loading screen if the node is still syncing
 */
export function HealthGate({ children }: { children?: React.ReactElement }): React.ReactElement | null {
  const { header, health } = useContext(HealthContext);
  const status = displayStatus(header, health);

  l.debug(status);

  switch (status.code) {
    case STATUS_DISPLAY_ERROR:
    case STATUS_WARN:
      return <Loading active>{status.message}</Loading>;
    default:
      return children || null;
  }
}
