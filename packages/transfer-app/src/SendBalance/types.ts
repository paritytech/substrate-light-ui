// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { SubmittableExtrinsic } from '@polkadot/api/submittable/types';
import { DerivedBalances, DerivedFees } from '@polkadot/api-derive/types';
import { Balance, Index } from '@polkadot/types/interfaces';
import BN from 'bn.js';

/**
 * Form fields inputted by the user
 */
export interface UserInputs {
  amountAsString: string;
  currentAccount: string;
  recipientAddress: string;
}

/**
 * Results from api subscription (nonce, balance, fees)
 */
export interface SubResults {
  accountNonce: Index;
  currentBalance: DerivedBalances;
  fees: DerivedFees;
  recipientBalance?: DerivedBalances;
}

/**
 * Amount as Balance
 */
export interface WithAmount {
  amount: Balance;
}

/**
 * Amount as Balance and Extrinsic
 */
export interface WithAmountExtrinsic extends WithAmount {
  extrinsic: SubmittableExtrinsic<'rxjs'>;
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
export type AllExtrinsicData = SubResults & UserInputs & WithAmountExtrinsic & WithDerived;

/**
 * Form errors and warnings
 */
export type Errors = Partial<Record<keyof (SubResults & UserInputs & WithAmountExtrinsic), string>>;
export type Warnings = string[];
