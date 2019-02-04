// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import ApiRx from '@polkadot/api/rx';
import * as React from 'react';

export const ApiContext: React.Context<ApiRx> = React.createContext({} as ApiRx);
