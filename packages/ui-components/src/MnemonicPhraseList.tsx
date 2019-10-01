// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';

import { StackedHorizontal } from './index';
import { DynamicSizeText } from './Shared.styles';

interface Props {
  phrase: string;
}

export function MnemonicPhraseList (props: Props) {
  const phrase = props.phrase.split(' ');
  const firstHalf = phrase.slice(0, phrase.length / 2);
  const secondHalf = phrase.slice(phrase.length / 2, phrase.length);

  return (
    <StackedHorizontal>
      <ol>
      {
        firstHalf.map((word: string) => {
          return (
            <li key={word}>
              <DynamicSizeText>
                {word}
              </DynamicSizeText>
            </li>
          );
        })
      }
      </ol>
      <ol start={phrase.length / 2}>
      {
        secondHalf.map((word: string) => {
          return (
              <li key={word}>
                <DynamicSizeText>
                  {word}
                </DynamicSizeText>
              </li>
          );
        })
      }
      </ol>
    </StackedHorizontal>
  );
}
