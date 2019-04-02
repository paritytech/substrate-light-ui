// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import BN from 'bn.js';

/**
 * All paths inside transfer are sub-routes of: `/transfer/:currentAccount`
 */
export interface MatchParams {
  currentAccount: string;
}

/**
 * Params needed for api.tx.balances.tranfer().
 */
export interface TransferParams {
  amount: BN;
  recipientAddress: string;
}
