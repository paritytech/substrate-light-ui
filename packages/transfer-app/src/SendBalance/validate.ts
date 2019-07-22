// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import ApiRx from '@polkadot/api/rx';
import { Balance, getTypeRegistry } from '@polkadot/types';
import { MAX_SIZE_BYTES, MAX_SIZE_MB } from '@polkadot/ui-signer/Checks/constants';
import { compactToU8a } from '@polkadot/util';
import BN from 'bn.js';
import { Either, left, right } from 'fp-ts/lib/Either';
import { none, some } from 'fp-ts/lib/Option';

import { AllExtrinsicData, Errors, SubResults, UserInputs, WithAmount, WithAmountExtrinsic } from './types';
import { SubmittableExtrinsic } from '@polkadot/api/SubmittableExtrinsic';

const LENGTH_PUBLICKEY = 32 + 1; // publicKey + prefix
const LENGTH_SIGNATURE = 64;
const LENGTH_ERA = 1;
const SIGNATURE_SIZE = LENGTH_PUBLICKEY + LENGTH_SIGNATURE + LENGTH_ERA;

/**
 * Make sure the amount (as a BN) is correct.
 */
function validateAmount (values: SubResults & UserInputs): Either<Errors, SubResults & UserInputs & WithAmount> {
  const { amountAsString, ...rest } = values;
  const amount = new Balance(amountAsString);

  if (amount.isNeg()) {
    return left({ amount: 'Please enter a positive amount to transfer.' });
  }

  if (amount.isZero()) {
    return left({ amount: 'Please make sure you are sending more than 0 balance.' });
  }

  return right({ amount, ...rest } as SubResults & UserInputs & WithAmount);
}

/**
 * Make sure derived validations (fees, minimal amount) are correct.
 * @see https://github.com/polkadot-js/apps/blob/master/packages/ui-signer/src/Checks/index.tsx#L63-L111
 */
function validateDerived (values: SubResults & UserInputs & WithAmountExtrinsic): Either<Errors, AllExtrinsicData> {
  const { accountNonce, amount, currentBalance, extrinsic, fees, recipientBalance } = values;

  const txLength = SIGNATURE_SIZE + compactToU8a(accountNonce).length + extrinsic.encodedLength;
  const allFees = fees.transactionBaseFee.add(fees.transactionByteFee.muln(txLength));

  let isCreation = false;
  let isNoEffect = false;

  if (recipientBalance !== undefined) {
    isCreation = recipientBalance.votingBalance.isZero() && fees.creationFee.gtn(0);
    isNoEffect = amount.add(recipientBalance.votingBalance).lte(fees.existentialDeposit);
  }

  const allTotal = amount.add(allFees).add(isCreation ? fees.creationFee : new BN(0));

  const hasAvailable = currentBalance.freeBalance.gte(allTotal);
  const isRemovable = currentBalance.votingBalance.sub(allTotal).lte(fees.existentialDeposit);
  const isReserved = currentBalance.freeBalance.isZero() && currentBalance.reservedBalance.gtn(0);
  const overLimit = txLength >= MAX_SIZE_BYTES;

  const errors = {} as Errors;

  if (!hasAvailable) {
    errors.amount = 'The selected account does not have the required balance available for this transaction.';
  }
  if (overLimit) {
    errors.amount = `This transaction will be rejected by the node as it is greater than the maximum size of ${MAX_SIZE_MB}MB.`;
  }

  return Object.keys(errors).length
    ? left(errors)
    : right({
      ...values,
      allFees,
      allTotal,
      hasAvailable,
      isCreation,
      isNoEffect,
      isRemovable,
      isReserved,
      overLimit
    });
}

/**
 * Add the extrinsic object, no validation done here.
 */
function validateExtrinsic (api: ApiRx) {
  return function (values: SubResults & UserInputs & WithAmount): Either<Errors, SubResults & UserInputs & WithAmountExtrinsic> {
    const { amount, recipientAddress } = values;
    const method = api.tx.balances.transfer(recipientAddress, amount);
    // FIXME this can't possibly the best way to do this? maybe use createSubmittableExtrinsic?
    const extrinsic = new (getTypeRegistry().getOrThrow('Extrinsic'))(method) as SubmittableExtrinsic<'rxjs'>;

    return right({ ...values, extrinsic } as SubResults & UserInputs & WithAmountExtrinsic);
  };
}

/**
 * Make sure the subscription results are here.
 */
function validateSubResults (values: Partial<SubResults & UserInputs>): Either<Errors, SubResults & UserInputs> {
  const { accountNonce, currentBalance, fees, recipientBalance, ...rest } = values;
  const errors = {} as Errors;

  if (!accountNonce) {
    errors.accountNonce = 'Please wait while we fetch your account nonce.';
  }

  if (!fees) {
    errors.fees = 'Please wait while we fetch transfer fees.';
  }

  if (!currentBalance) {
    errors.currentBalance = 'Please wait while we fetch your voting balance.';
  }

  if (!recipientBalance) {
    errors.recipientBalance = "Please wait while we fetch the recipient's balance.";
  }

  return Object.keys(errors).length
    ? left(errors)
    : right({ accountNonce, currentBalance, fees, recipientBalance, ...rest } as SubResults & UserInputs);
}

/**
 * Make sure everything the user inputted is correct.
 */
function validateUserInputs (values: Partial<SubResults & UserInputs>): Either<Errors, Partial<SubResults> & UserInputs> {
  const { amountAsString, currentAccount, recipientAddress, ...rest } = values;
  const errors = {} as Errors;

  if (!currentAccount) {
    errors.currentAccount = 'Please enter a sender account.';
  }

  if (!recipientAddress) {
    errors.recipientAddress = 'Please enter a recipient address.';
  }

  if (currentAccount === recipientAddress) {
    errors.currentAccount = 'You cannot send balance to yourself.';
  }

  if (!amountAsString) {
    errors.amount = 'Please enter an amount';
  }

  return Object.keys(errors).length
    ? left(errors)
    : right({ amountAsString, currentAccount, recipientAddress, ...rest } as Partial<SubResults> & UserInputs);
}

/**
 * Show some warnings, that are not blocking the transaction, but may have
 * undesirable effects for the user.
 * @see https://github.com/polkadot-js/apps/blob/master/packages/ui-signer/src/Checks/index.tsx#L158-L168
 */
export function validateWarnings (values: AllExtrinsicData) {
  const { fees, hasAvailable, isCreation, isNoEffect, isRemovable, isReserved } = values;

  const warnings = [];

  if (isRemovable && hasAvailable) {
    warnings.push('Submitting this transaction will drop the account balance to below the existential amount, which can result in the account being removed from the chain state and associated funds burned.');
  }

  if (isNoEffect) {
    warnings.push('The final recipient balance is less than the existential amount and will not be reflected.');
  }

  if (isCreation) {
    warnings.push(`A fee of ${fees.creationFee} will be deducted from the sender since the destination account does not exist.`);
  }

  if (isReserved) {
    warnings.push('This account does have a reserved/locked balance, not taken into account');
  }

  return warnings.length > 0 ? some(warnings) : none;
}

/**
 * Validate everything. The order of validation should be easily readable
 * from the `.chain()` syntax.
 */
export function validate (
  values: Partial<UserInputs & SubResults>,
  api: ApiRx
): Either<Errors, AllExtrinsicData> {

  return validateUserInputs(values)
    .chain(validateSubResults)
    .chain(validateAmount)
    .chain(validateExtrinsic(api))
    .chain(validateDerived);
}
