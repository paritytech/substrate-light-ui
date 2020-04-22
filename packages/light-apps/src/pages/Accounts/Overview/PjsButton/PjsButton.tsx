// Copyright 2018-2020 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Button, Icon } from '@substrate/ui-components';
import React, { useCallback, useContext } from 'react';

import {
  InjectedContext,
  POLKADOTJS_EXTENSION_NAME,
} from '../../../../components/context';

export function PjsButton(): React.ReactElement | null {
  const { enable, injected } = useContext(InjectedContext);

  const handleClick = useCallback(() => {
    enable(POLKADOTJS_EXTENSION_NAME);
  }, [enable]);

  // Don't show it if no extension is detected.
  if (!window.injectedWeb3 || !window.injectedWeb3[POLKADOTJS_EXTENSION_NAME]) {
    return null;
  }

  // Don't show it if we already enabled it.
  if (injected[POLKADOTJS_EXTENSION_NAME]) {
    return null;
  }

  return (
    <Button basic icon labelPosition='right' onClick={handleClick}>
      <Icon name='plus' />
      Connect PolkadotJS Extension
    </Button>
  );
}
