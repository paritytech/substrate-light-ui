// Copyright 2018-2020 @paritytech/Nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import keyring from '@polkadot/ui-keyring';
import accountObservable from '@polkadot/ui-keyring/observable/accounts';
import addressObservable from '@polkadot/ui-keyring/observable/addresses';
import { SubjectInfo } from '@polkadot/ui-keyring/observable/types';
import { KeyringOptions } from '@polkadot/ui-keyring/types';
import { logger } from '@polkadot/util';
import { SystemContext } from '@substrate/context';
import React, { useContext, useEffect, useState } from 'react';

interface KeyringContext {
  accounts: SubjectInfo;
  addresses: SubjectInfo;
  currentAccount?: string;
  keyring: typeof keyring;
  isKeyringReady: boolean;
  setCurrentAccount: React.Dispatch<React.SetStateAction<string | undefined>>;
}

interface KeyringContextProps extends KeyringOptions {
  children: React.ReactElement;
}

export const KeyringContext = React.createContext({} as KeyringContext);

// Most chains (including Kusama) put the ss58 prefix in the chain properties.
// Just in case, we default to 42
const DEFAULT_SS58_PREFIX = 42;

const l = logger('keyring-context');

export function KeyringContextProvider(
  props: KeyringContextProps
): React.ReactElement {
  const { children, ...rest } = props;
  const { genesisHash, properties } = useContext(SystemContext);
  const [isKeyringReady, setIsKeyringReady] = useState(false);
  const [accounts, setAccounts] = useState<SubjectInfo>({});
  const [addresses, setAddresses] = useState<SubjectInfo>({});
  const [currentAccount, setCurrentAccount] = useState<string>();

  useEffect(() => {
    const ss58Format =
      properties.ss58Format.unwrapOr(undefined)?.toNumber() ||
      DEFAULT_SS58_PREFIX;

    keyring.loadAll({
      genesisHash,
      ss58Format,
      type: 'ed25519',
      ...rest,
    } as KeyringOptions);

    const accountsSub = accountObservable.subject.subscribe((acc) => {
      setAccounts(acc);
      // FIXME Save currentAccount into localStorage, so that subsequent loads
      // loads the same account
      setCurrentAccount(Object.keys(acc)[0]);
    });
    const addressesSub = addressObservable.subject.subscribe(setAddresses);

    setIsKeyringReady(true);
    l.log(`Keyring initialized with ss58Format=${ss58Format}`);

    return (): void => {
      accountsSub.unsubscribe();
      addressesSub.unsubscribe();
    };
    // Only run effect once
    // eslint-disable-next-line
  }, []);

  return (
    <KeyringContext.Provider
      value={{
        accounts,
        addresses,
        currentAccount,
        isKeyringReady,
        keyring,
        setCurrentAccount,
      }}
    >
      {children}
    </KeyringContext.Provider>
  );
}
