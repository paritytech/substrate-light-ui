// Copyright 2018-2020 @paritytech/Nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';

import { Input } from './index';

/**
 * Random word in the mnemonic phrase.
 */
export interface MnemonicRandomWord {
  position: number;
  word: string;
}

interface Props {
  firstWord: string;
  secondWord: string;
  thirdWord: string;
  fourthWord: string;
  randomFourWords: MnemonicRandomWord[];
  handleSetFirstWord: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSetSecondWord: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSetThirdWord: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSetFourthWord: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function MnemonicRewriteParts(props: Props): React.ReactElement {
  const {
    firstWord,
    secondWord,
    thirdWord,
    fourthWord,
    randomFourWords,
    handleSetFirstWord,
    handleSetSecondWord,
    handleSetThirdWord,
    handleSetFourthWord,
  } = props;

  return (
    <>
      <Input
        textLabel={randomFourWords[0].position}
        borderless
        onChange={handleSetFirstWord}
        value={firstWord}
        wrapClass='code red items-center mr3 mb3'
      />
      <Input
        textLabel={randomFourWords[1].position}
        borderless
        onChange={handleSetSecondWord}
        value={secondWord}
        wrapClass='code red items-center mr3 mb3'
      />
      <Input
        textLabel={randomFourWords[2].position}
        borderless
        onChange={handleSetThirdWord}
        value={thirdWord}
        wrapClass='code red items-center mr3 mb3'
      />
      <Input
        textLabel={randomFourWords[3].position}
        borderless
        onChange={handleSetFourthWord}
        value={fourthWord}
        wrapClass='code red items-center mr3 mb3'
      />
    </>
  );
}
