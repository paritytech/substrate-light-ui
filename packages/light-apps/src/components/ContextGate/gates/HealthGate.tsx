// Copyright 2018-2020 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { HealthContext, HealthContextType } from '@substrate/context';
import { Loading } from '@substrate/ui-components';
import React, { useContext } from 'react';

const STATUS_GOOD = 0;
const STATUS_WARN = 1;
const STATUS_ERROR = 2;

export type STATUS_CODE =
  | typeof STATUS_GOOD // All good (green)
  | typeof STATUS_WARN // Warning (yellow)
  | typeof STATUS_ERROR; // Error (red)

export interface Status {
  code: STATUS_CODE;
  message?: string;
}

/**
 * Transform the health information into a color-coded overlay
 *
 * @param header - The latest header of the light node
 * @param health - The health of the light node
 */
export function displayStatus(health: HealthContextType): Status {
  if (!health.isNodeConnected) {
    return {
      code: STATUS_ERROR,
      message: 'Connecting to node...',
    };
  }

  if (!health.hasPeers) {
    return {
      code: STATUS_ERROR,
      message: 'Finding peers on the network...',
    };
  }

  if (health.isSyncing) {
    return {
      code: STATUS_WARN,
      message: `Syncing #${health.best}...`,
    };
  }

  return {
    code: STATUS_GOOD,
  };
}

/**
 * A gate that shows a loading screen if the node is still syncing
 */
export function HealthGate({
  children,
}: {
  children?: React.ReactElement;
}): React.ReactElement {
  const health = useContext(HealthContext);
  const status = displayStatus(health);

  const showLoading = [STATUS_ERROR, STATUS_WARN].includes(status.code);

  return (
    <Loading active={showLoading} loadingText={status.message}>
      {!showLoading && children}
    </Loading>
  );
}
