// Copyright 2018-2020 @paritytech/Nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';

import { Input } from './index';

interface Props {
  firstWord: string;
  secondWord: string;
  thirdWord: string;
  fourthWord: string;
  randomFourWords: Array<Array<string>>;
  handleSetFirstWord: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSetSecondWord: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSetThirdWord: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSetFourthWord: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function MnemonicRewriteParts(props: Props): React.ReactElement {
  const {
    randomFourWords,
    firstWord,
    secondWord,
    thirdWord,
    fourthWord,
    handleSetFirstWord,
    handleSetSecondWord,
    handleSetThirdWord,
    handleSetFourthWord,
  } = props;

  return (
    <>
      <Input
        textLabel={randomFourWords[0][0]}
        borderless
        onChange={handleSetFirstWord}
        value={firstWord}
        wrapClass='code red items-center mr3 mb3'
      />
      <Input
        textLabel={randomFourWords[1][0]}
        borderless
        onChange={handleSetSecondWord}
        value={secondWord}
        wrapClass='code red items-center mr3 mb3'
      />
      <Input
        textLabel={randomFourWords[2][0]}
        borderless
        onChange={handleSetThirdWord}
        value={thirdWord}
        wrapClass='code red items-center mr3 mb3'
      />
      <Input
        textLabel={randomFourWords[3][0]}
        borderless
        onChange={handleSetFourthWord}
        value={fourthWord}
        wrapClass='code red items-center mr3 mb3'
      />
    </>
  );
}
