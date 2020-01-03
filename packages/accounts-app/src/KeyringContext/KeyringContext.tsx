// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import keyring from '@polkadot/ui-keyring';
import { KeyringOptions } from '@polkadot/ui-keyring/types';
import { ApiContext } from '@substrate/context';
import React, { useContext, useEffect } from 'react';

interface KeyringContext {
  keyring: typeof keyring;
}

export const KeyringContext = React.createContext({} as KeyringContext);

// Most chains (including Kusama) put the ss58 prefix in the chain properties.
// Just in case, we default to 42
const DEFAULT_SS58_PREFIX = 42;

export function KeyringContextProvider(props: { children: React.ReactNode }): React.ReactElement {
  const { children } = props;
  const { api, system } = useContext(ApiContext);

  useEffect(() => {
    keyring.loadAll({
      genesisHash: api.genesisHash,
      ss58Format: system.properties.ss58Format.unwrapOr(api.createType('u32', DEFAULT_SS58_PREFIX)).toNumber(),
      type: 'ed25519',
    } as KeyringOptions);
  }, [api, system]);

  return <KeyringContext.Provider value={{ keyring }}>{children}</KeyringContext.Provider>;
}
