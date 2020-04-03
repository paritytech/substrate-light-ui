// Copyright 2018-2020 @paritytech/Nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { InjectedAccount } from '@polkadot/extension-inject/types';
import React, { useEffect, useState } from 'react';

import { Injected } from '../InjectedContext/Injected';

interface AccountContext {
  accounts: Map<string, InjectedAccount>;
}

interface AccountContextProps {
  children: React.ReactElement;
  injected?: Injected;
  originName: string;
}

export const AccountContext = React.createContext({} as AccountContext);

export function AccountContextProvider(
  props: AccountContextProps
): React.ReactElement {
  const { children, injected, originName } = props;
  const [extensionAccounts, setExtensionAccounts] = useState<InjectedAccount[]>(
    []
  );

  useEffect(() => {
    if (!injected) {
      return;
    }

    injected.accounts.subscribe(setExtensionAccounts);
  }, [injected, originName]);

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
