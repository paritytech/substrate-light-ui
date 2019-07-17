// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AccountId, BlockNumber } from '@polkadot/types';
import BN from 'bn.js';

export type Accounts = {
  stash: string,
  controller: string
};

type Error = string;
export type Errors = Array<Error>;

export type RecentlyOffline = [AccountId, BlockNumber, BN][];

export type RecentlyOfflineMap = Record<string, OfflineStatus[]>;

export interface OfflineStatus {
  blockNumber: BlockNumber;
  count: BN;
}
