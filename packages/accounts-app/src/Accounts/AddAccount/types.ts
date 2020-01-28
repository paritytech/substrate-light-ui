// Copyright 2018-2020 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

export type Steps = 'copy' | 'rewrite' | 'meta';

export type TagOption = {
  key: string;
  text: string;
  value: string;
};

export type Tags = Array<string>;

export type TagOptions = Array<TagOption>;

export interface PhrasePartialRewrite {
  firstWord: string; // from rewrite
  secondWord: string; // from rewrite
  thirdWord: string; // from rewrite
  fourthWord: string; // from rewrite
}

export interface UserInput {
  name: string;
  password: string;
  tags: Tags | string;
}

export type UserInputError = Partial<UserInput>;
export interface PhrasePartialRewriteError {
  emptyFields: string;
  incorrectFields: string;
}
