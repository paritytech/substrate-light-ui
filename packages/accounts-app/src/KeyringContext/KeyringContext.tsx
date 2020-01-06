// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import keyring from '@polkadot/ui-keyring';
import accountObservable from '@polkadot/ui-keyring/observable/accounts';
import { KeyringOptions } from '@polkadot/ui-keyring/types';
import { System } from '@substrate/context';
import React, { useEffect, useState } from 'react';

interface KeyringContext {
  allAccounts?: string[];
  keyring: typeof keyring;
  keyringReady: boolean;
}

interface KeyringContextProps {
  api?: any;
  children: React.ReactNode;
  isReady?: boolean;
  system?: System;
}

export const KeyringContext = React.createContext({} as KeyringContext);

// Most chains (including Kusama) put the ss58 prefix in the chain properties.
// Just in case, we default to 42
const DEFAULT_SS58_PREFIX = 42;

export function KeyringContextProvider(props: KeyringContextProps): React.ReactElement {
  const { api, children, system } = props;
  const [keyringReady, setKeyringReady] = useState(false);
  const [allAccounts, setAllAccounts] = useState<string[] | undefined>();

  useEffect(() => {
    if (api && system) {
      keyring.loadAll({
        genesisHash: api.genesisHash,
        ss58Format: system.properties.ss58Format.unwrapOr(api.createType('u32', DEFAULT_SS58_PREFIX)).toNumber(),
        type: 'ed25519',
      } as KeyringOptions);
      const accountsSub = accountObservable.subject.subscribe(accounts => {
        const allAccounts = accounts ? Object.keys(accounts) : [];

        setAllAccounts(allAccounts);
      });

      setKeyringReady(true);

      return (): void => accountsSub.unsubscribe();
    }
  }, [api, system]);

  return (
    <KeyringContext.Provider
      value={{
        allAccounts,
        keyring,
        keyringReady,
      }}
    >
      {children}
    </KeyringContext.Provider>
  );
}
