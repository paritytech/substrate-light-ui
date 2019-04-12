// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Balance } from '@polkadot/types';

// All fields necessary to perform form validation
export interface FormFields {
  amount?: Balance;
  balance?: Balance;
  currentAccount?: string;
  recipientAddress?: string;
}
