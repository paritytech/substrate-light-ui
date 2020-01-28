// Copyright 2018-2020 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import keyring from '@polkadot/ui-keyring';
import accountObservable from '@polkadot/ui-keyring/observable/accounts';
import addressObservable from '@polkadot/ui-keyring/observable/addresses';
import { SubjectInfo } from '@polkadot/ui-keyring/observable/types';
import { KeyringOptions } from '@polkadot/ui-keyring/types';
import React, { useEffect, useState } from 'react';

interface KeyringContext {
  accounts: SubjectInfo;
  addresses: SubjectInfo;
  keyring: typeof keyring;
  keyringReady: boolean;
}

interface KeyringContextProps extends KeyringOptions {
  children: React.ReactNode;
}

export const KeyringContext = React.createContext({} as KeyringContext);

// Most chains (including Kusama) put the ss58 prefix in the chain properties.
// Just in case, we default to 42
const DEFAULT_SS58_PREFIX = 42;

export function KeyringContextProvider(props: KeyringContextProps): React.ReactElement {
  const { children, genesisHash, ss58Format } = props;
  const [keyringReady, setKeyringReady] = useState(false);
  const [accounts, setAccounts] = useState<SubjectInfo>({});
  const [addresses, setAddresses] = useState<SubjectInfo>({});

  useEffect(() => {
    keyring.loadAll({
      genesisHash: genesisHash,
      ss58Format: ss58Format || DEFAULT_SS58_PREFIX,
      type: 'ed25519',
    } as KeyringOptions);
    const accountsSub = accountObservable.subject.subscribe(setAccounts);
    const addressesSub = addressObservable.subject.subscribe(setAddresses);

    setKeyringReady(true);

    return (): void => {
      accountsSub.unsubscribe();
      addressesSub.unsubscribe();
    };
  }, [genesisHash, ss58Format]);

  return (
    <KeyringContext.Provider
      value={{
        accounts,
        addresses,
        keyring,
        keyringReady,
      }}
    >
      {children}
    </KeyringContext.Provider>
  );
}
