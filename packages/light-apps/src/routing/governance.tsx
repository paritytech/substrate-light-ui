// Copyright 2017-2018 @polkadot/light-apps authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Routes } from '../types';

import { Governance } from '@polkadot/governance';

export default ([
  {
    Component: Governance,
    i18n: {
      defaultValue: 'Governance'
    },
    icon: 'calendar check',
    isApiGated: true,
    isHidden: false,
    name: 'governance'
  }
] as Routes);
