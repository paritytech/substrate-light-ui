// Copyright 2017-2018 @polkadot/light-apps authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Routes } from '../types';

import { AccountManagement } from '@polkadot/account-management';

export default ([
  {
    Component: AccountManagement,
    i18n: {
      defaultValue: 'AccountManagement'
    },
    icon: 'users',
    isApiGated: true,
    isHidden: false,
    name: 'Identity'
  }
] as Routes);
