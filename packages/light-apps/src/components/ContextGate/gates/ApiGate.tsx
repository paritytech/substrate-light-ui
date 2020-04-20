// Copyright 2018-2020 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ApiRxContext } from '@substrate/context';
import { Loading } from '@substrate/ui-components';
import React, { useContext } from 'react';

/**
 * A gate that shows a loading screen if the node is not connected yet
 */
export function ApiGate({
  children,
}: {
  children?: React.ReactElement;
}): React.ReactElement {
  const { isApiReady } = useContext(ApiRxContext);

  return (
    <Loading active={!isApiReady} loadingText='Initializing API...'>
      {isApiReady && children}
    </Loading>
  );
}
