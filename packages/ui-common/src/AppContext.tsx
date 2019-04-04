// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import ApiRx from '@polkadot/api/rx';
import keyring from '@polkadot/ui-keyring';
import React from 'react';

import { AlertStore } from './alerts';

// The reasons why we regroup all contexts in one big context is:
// 1. I don't like the render props syntax with the context consumer. -Amaury
// 2. We want to access Context in lifecycle methods like componentDidMount.
// It's either adding a wrapper and passing as props, like:
// https://github.com/facebook/react/issues/12397#issuecomment-375501574
// or use one context for everything:
// https://github.com/facebook/react/issues/12397#issuecomment-462142714
export interface AppContextType {
  readonly alerts: AlertStore; // UI alerts
  readonly api: ApiRx; // From @polkadot/api
  readonly isReady: boolean; // Are api and keyring loaded?
  readonly keyring: typeof keyring; // From @polkadot/ui-keyring
  readonly system: any;
}

export const AppContext: React.Context<AppContextType> = React.createContext({} as AppContextType);
