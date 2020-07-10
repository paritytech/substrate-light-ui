// Copyright 2018-2020 @paritytech/Nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { InjectedAccount } from '@polkadot/extension-inject/types';
import React, { useCallback, useEffect, useState } from 'react';

import { Injected } from '../InjectedContext/Injected';

interface AccountContext {
  accounts: Map<string, InjectedAccount>;
}

interface AccountContextProps {
  children: React.ReactElement;
  injected: Record<string, Injected>;
}

export const AccountContext = React.createContext({} as AccountContext);

export function AccountContextProvider(
  props: AccountContextProps
): React.ReactElement {
  const { children, injected } = props;
  const [extensionAccounts, setExtensionAccounts] = useState<InjectedAccount[]>(
    []
  );

  /**
   * Merge new accounts with existing accounts.
   */
  const mergeAccounts = useCallback(
    (newAccounts) =>
      setExtensionAccounts([...extensionAccounts, ...newAccounts]),
    [extensionAccounts]
  );

  useEffect(() => {
    // Get all accounts from all injected extensions.
    const unsubs = Object.values(injected).map((injected) => {
      return injected.accounts.subscribe(mergeAccounts);
    });

    return (): void => unsubs.forEach((unsub) => unsub());

    // We only want to update this effect on `injected` change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [injected]);

  // From an array of accounts, get a map of address->account.
  const accounts = extensionAccounts.reduce(
    (accumulator, account) => accumulator.set(account.address, account),
    new Map<string, InjectedAccount>()
  );

  return (
    <AccountContext.Provider value={{ accounts }}>
      {children}
    </AccountContext.Provider>
  );
}
