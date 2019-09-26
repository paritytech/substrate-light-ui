// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Keyring } from '@polkadot/ui-keyring';
import { mnemonicToSeed, naclKeypairFromSeed } from '@polkadot/util-crypto';
import { Either, left, right } from 'fp-ts/lib/Either';

import { UserInput, UserInputError } from './types';

/**
 * Derive public address from mnemonic key
 */
export function generateAddressFromMnemonic (keyring: Keyring, mnemonic: string): string {
  const keypair = naclKeypairFromSeed(mnemonicToSeed(mnemonic));

  return keyring.encodeAddress(
    keypair.publicKey
  );
}

/**
 * Validate user inputs
 */
export function validate (values: UserInput): Either<UserInputError, UserInput> {
  const errors = {} as UserInputError;

  (['name', 'password', 'rewritePhrase'] as (Exclude<keyof UserInput, 'tags'>)[])
    .filter((key) => !values[key])
    .forEach((key) => {
      errors[key] = `Field "${key}" cannot be empty`;
    });

  if (values.mnemonic !== values.rewritePhrase) {
    errors.rewritePhrase = 'Mnemonic does not match rewrite';
  }

  // @ts-ignore
  values.tags = values.tags.map(tag => tag.toLowerCase());

  // Should not tag an account as both a stash and controller
  if (values.tags.includes('stash') && values.tags.includes('controller')) {
    errors.tags = 'Each account should be either a Stash or a Controller, not both.';
  }

  console.log('errors => ', errors);

  return Object.keys(errors).length ? left(errors) : right(values);
}
