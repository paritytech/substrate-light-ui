// Copyright 2018-2020 @paritytech/Nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import {
  DeriveBalancesAll,
  DeriveFees,
  DeriveStakingAccount,
} from '@polkadot/api-derive/types';
import { SubmittableExtrinsic } from '@polkadot/api/submittable/types';
import { AccountInfo, Balance } from '@polkadot/types/interfaces';
import BN from 'bn.js';

export type AccountDerivedStakingMap = Record<string, DeriveStakingAccount>;

/**
 * Form fields inputted by the user
 */
export interface UserInputs {
  amountAsString: string;
  recipientAddress: string;
  senderAddress: string;
}

/**
 * Results from api subscription (nonce, balance, fees)
 */
export interface SubResults {
  accountNonce: AccountInfo;
  currentBalance: DeriveBalancesAll;
  fees: DeriveFees;
  recipientBalance?: DeriveBalancesAll;
}

export interface WithExtrinsic {
  extrinsic: SubmittableExtrinsic<'rxjs'>;
}

/**
 * Amount as Balance
 */
export interface WithAmount {
  amount: Balance;
}

/**
 * Derived fees and flags from subscription results and user inputs
 */
export interface WithDerived {
  allFees: BN;
  allTotal: BN;
  hasAvailable: boolean;
  isCreation: boolean;
  isNoEffect: boolean;
  isRemovable: boolean;
  isReserved: boolean;
  overLimit: boolean;
}

/**
 * Everything above
 */
export type AllExtrinsicData = SubResults &
  UserInputs &
  WithExtrinsic &
  WithAmount &
  WithDerived;

/**
 * Form errors and warnings
 */
export type Errors = Partial<
  Record<keyof (SubResults & UserInputs & WithExtrinsic & WithAmount), string>
>;
export type Warnings = string[];
