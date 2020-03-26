// Copyright 2018-2020 @paritytech/Nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { web3AccountsSubscribe, web3Enable } from '@polkadot/extension-dapp';
import { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';
import { logger } from '@polkadot/util';
import React, { useEffect, useState } from 'react';

interface AccountContext {
  accounts: Map<string, InjectedAccountWithMeta>;
}

interface AccountContextProps {
  children: React.ReactElement;
  originName: string;
}

export const AccountContext = React.createContext({} as AccountContext);

const l = logger('account-context');

export function AccountContextProvider(
  props: AccountContextProps
): React.ReactElement {
  const { children, originName } = props;
  const [extensionAccounts, setExtensionAccounts] = useState<
    InjectedAccountWithMeta[]
  >([]);

  useEffect(() => {
    async function getAccounts(): Promise<void> {
      const extensions = await web3Enable(originName);

      if (!extensions.length) {
        return;
      }

      web3AccountsSubscribe(setExtensionAccounts);
    }

    getAccounts().catch(l.error);
  }, [originName]);

  const accounts = extensionAccounts.reduce((accumulator, account) => {
    accumulator.set(account.address, account);

    return accumulator;
  }, new Map<string, InjectedAccountWithMeta>());

  return (
    <AccountContext.Provider value={{ accounts }}>
      {children}
    </AccountContext.Provider>
  );
}
