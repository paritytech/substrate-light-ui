// Copyright 2018-2020 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Either, left, right } from 'fp-ts/lib/Either';

import {
  PhrasePartialRewrite,
  PhrasePartialRewriteError,
  UserInput,
  UserInputError,
} from './types';

/**
 * Fischer Yates shuffle numbers between 0 and @max
 * @param max highest number the random number should be
 */
export function getRandomInts(max: number): number[] {
  const scratch = [];

  // populate with the range of possible numbers
  for (let i = 1; i <= max; ++i) {
    scratch.push(i);
  }

  let temp;
  let randIndex;

  for (let i = max - 1; i >= 0; i -= 1) {
    randIndex = Math.floor(Math.random() * Math.floor(i));
    temp = scratch[i];
    scratch[i] = scratch[randIndex];
    scratch[randIndex] = temp;
  }

  return scratch;
}

/**
 * Validate user inputs
 */
export function validateMeta(
  values: UserInput,
  step: string
): Either<UserInputError, UserInput> {
  const errors = {} as UserInputError;

  if (step === 'meta') {
    (['name', 'password'] as Exclude<keyof UserInput, 'tags'>[])
      .filter((key) => !values[key])
      .forEach((key) => {
        errors[key] = `Field "${key}" cannot be empty`;
      });
  }

  return Object.keys(errors).length ? left(errors) : right(values);
}

/**
 * Validate phrase rewrite
 */
export function validateRewrite(
  values: PhrasePartialRewrite,
  randomFourWords: Array<Array<string>>
): Either<PhrasePartialRewriteError, PhrasePartialRewrite> {
  const errors = {} as PhrasePartialRewriteError;

  const { firstWord, secondWord, thirdWord, fourthWord } = values;

  if (!firstWord || !secondWord || !thirdWord || !fourthWord) {
    errors.emptyFields =
      'All fields must be set to be sure you copied the phrase correctly.';
  }

  if (
    firstWord === randomFourWords[0][1] &&
    secondWord === randomFourWords[1][1] &&
    thirdWord === randomFourWords[2][1] &&
    fourthWord === randomFourWords[3][1]
  ) {
    return right(values);
  } else {
    errors.incorrectFields =
      'It seems you did not copy all the words properly. Please double check your inputs and try again.';
  }

  return Object.keys(errors).length ? left(errors) : right(values);
}
