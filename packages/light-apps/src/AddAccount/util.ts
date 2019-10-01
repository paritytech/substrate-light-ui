// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Keyring } from '@polkadot/ui-keyring';
import { mnemonicToSeed, naclKeypairFromSeed } from '@polkadot/util-crypto';
import { Either, left, right } from 'fp-ts/lib/Either';

import { UserInput, UserInputError, PhrasePartialRewrite, PhrasePartialRewriteError } from './types';
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
export function validateMeta (values: UserInput, step: string): Either<UserInputError, UserInput> {
  const errors = {} as UserInputError;

  if (step === 'meta') {
    (['name', 'password', 'rewritePhrase'] as (Exclude<keyof UserInput, 'tags'>)[])
    .filter((key) => !values[key])
    .forEach((key) => {
      errors[key] = `Field "${key}" cannot be empty`;
    });
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

export function validateRewrite (values: PhrasePartialRewrite, randomFourWords: Array<Array<string>>): Either<PhrasePartialRewriteError, PhrasePartialRewrite> {
  let errors = {} as PhrasePartialRewriteError;

  const { firstWord, secondWord, thirdWord, fourthWord } = values;

  if (!firstWord || !secondWord || !thirdWord || !fourthWord) {
    errors.emptyFields = 'All fields must be set to be sure you copied the phrase correctly.';
  }

  if (
      firstWord === randomFourWords[0][1]
      && secondWord === randomFourWords[1][1]
      && thirdWord === randomFourWords[2][1]
      && fourthWord === randomFourWords[3][1]
    ) {
    return right(values);
  } else {
    errors.incorrectFields = 'It seems you did not copy all the words properly. Please double check your inputs and try again.';
  }

  return Object.keys(errors).length ? left(errors) : right(values);
}
