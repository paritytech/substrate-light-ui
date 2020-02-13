// Copyright 2018-2020 @paritytech/Nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';

import {
  Input,
  Labelled,
  Margin,
  Stacked,
  StackedHorizontal,
  WrapperDiv,
} from './index';

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
    <WrapperDiv margin='0' padding='0'>
      <StackedHorizontal>
        <Stacked>
          <Labelled label={randomFourWords[0][0]} withLabel>
            <Input onChange={handleSetFirstWord} value={firstWord} />
          </Labelled>
          <Margin top />
          <Labelled label={randomFourWords[1][0]} withLabel>
            <Input onChange={handleSetSecondWord} value={secondWord} />
          </Labelled>
        </Stacked>

        <Stacked>
          <Labelled label={randomFourWords[2][0]} withLabel>
            <Input onChange={handleSetThirdWord} value={thirdWord} />
          </Labelled>
          <Margin top />
          <Labelled label={randomFourWords[3][0]} withLabel>
            <Input onChange={handleSetFourthWord} value={fourthWord} />
          </Labelled>
        </Stacked>
      </StackedHorizontal>
    </WrapperDiv>
  );
}
