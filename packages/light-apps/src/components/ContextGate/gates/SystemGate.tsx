// Copyright 2018-2020 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { SystemContext } from '@substrate/context';
import { Loading } from '@substrate/ui-components';
import React, { useContext } from 'react';

import { ProviderContext } from '../../context';

/**
 * A gate that shows a loading screen if the node is not connected yet
 */
export function SystemGate({
  children,
}: {
  children?: React.ReactElement;
}): React.ReactElement {
  const { provider } = useContext(ProviderContext);
  const { isSystemReady } = useContext(SystemContext);

  return (
    <Loading
      active={!isSystemReady}
      loadingText={provider ? 'Connecting to node...' : 'Choosing provider...'}
    >
      {isSystemReady && children}
    </Loading>
  );
}
