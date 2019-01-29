// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

// take a word or sentence and return it in camel case
export const camelize = (str: string): string => {
  return str.replace(/(?:^\w|[A-Z]|\b\w)/g,
    (letter: string, index: number) => {
      return index === 0 ? letter.toLowerCase() : letter.toUpperCase();
    }
  ).replace(/\s+/g, '');
};

// take a word or sentence and return it in camel case but first word also capitalized
export const camlizeInclusiveFirst = (str: string): string => {
  return str.toLowerCase()
    .split(' ')
    .map(word => word[0].toUpperCase() + word.substr(1))
    .join(' ');
};
