// Copyright 2018-2020 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Loading } from '@substrate/ui-components';
import React, { useContext } from 'react';

import { SystemContext } from '../../context';

/**
 * A gate that shows a loading screen if the node is not connected yet
 */
export function SystemGate({ children }: { children?: React.ReactElement }): React.ReactElement | null {
  const { isSystemReady } = useContext(SystemContext);

  return isSystemReady ? children || null : <Loading active>Connecting to node...</Loading>;
}
