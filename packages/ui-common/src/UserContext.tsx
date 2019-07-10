// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React, { useContext, useState, createContext, useEffect } from 'react';
import { AppContext } from '.';

export const UserContext = createContext({
  bondingPreferences: {},
  isNominating: false,
  setBondingPreferences: (bondingPreferences: any) => { console.error('No context provider found above in the tree.'); },
  setIsNominating: (isNominating: boolean) => { console.error('No context provider found above in the tree.'); }
});

interface Props {
  children: any;
}

// Provides context about the :currentAccount at various routes for all packages
export function UserContextProvider (props: Props) {
  const { api } = useContext(AppContext);
  const [{ bondingPreferences, isNominating }, setUserContext] = useState({ bondingPreferences: {}, isNominating: false });

  useEffect(() => {

  });

  const setBondingPreferences = (bondingPreferences: any) => {
    setUserContext({
      bondingPreferences,
      isNominating
    });
  };

  const setIsNominating = (isNominating: boolean) => {
    setUserContext({
      bondingPreferences,
      isNominating
    });
  };

  return (
    <UserContext.Provider value={{ bondingPreferences, isNominating, setBondingPreferences, setIsNominating }}>
      {props.children}
    </UserContext.Provider>
  );
}
