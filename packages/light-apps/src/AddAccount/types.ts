// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

export type Steps = 'copy' | 'rewrite' | 'meta';

export type TagOption = {
  key: string,
  text: string,
  value: string
};

export type Tags = Array<string>;

export type TagOptions = Array<TagOption>;

export interface UserInput {
  mnemonic: string;
  name: string;
  password: string;
  rewritePhrase: string;
  tags: Tags | string;
}

export interface UserInputError extends Partial<UserInput> { }
