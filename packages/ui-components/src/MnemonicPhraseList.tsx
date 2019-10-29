// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';

import { DynamicSizeText, FadedText, StackedHorizontal, WithSpace } from './index';
import { WrapperDiv } from './Shared.styles';

interface Props {
  phrase: string;
}

export function MnemonicPhraseList (props: Props): React.ReactElement {
  const phrase = props.phrase.split(' ');
  const firstHalf = phrase.slice(0, phrase.length / 2);
  const secondHalf = phrase.slice(phrase.length / 2, phrase.length);

  return (
    <WrapperDiv margin='0' padding='0'>
      <StackedHorizontal margin='0' justifyContent='space-around'>
        <ol>
          {
            firstHalf.map((word: string) => {
              return (
                <li key={word}>
                  <WithSpace>
                    <DynamicSizeText>
                      <FadedText>
                        {word}
                      </FadedText>
                    </DynamicSizeText>
                  </WithSpace>
                </li>
              );
            })
          }
        </ol>
        <ol start={phrase.length / 2 + 1}>
          {
            secondHalf.map((word: string) => {
              return (
                <li key={word}>
                  <WithSpace>
                    <DynamicSizeText>
                      <FadedText>
                        {word}
                      </FadedText>
                    </DynamicSizeText>
                  </WithSpace>
                </li>
              );
            })
          }
        </ol>
      </StackedHorizontal>
    </WrapperDiv>
  );
}
