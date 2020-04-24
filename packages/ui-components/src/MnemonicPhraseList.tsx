// Copyright 2018-2020 @paritytech/Nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';

import { Input } from './Input';

interface Props {
  phrase: string;
}

export function MnemonicPhraseList(props: Props): React.ReactElement {
  const phrase = props.phrase.split(' ');

  return (
    <>
      {phrase.map((word: string, i) => {
        return (
          <Input
            borderless={true}
            fake={true}
            key={word}
            textLabel={i + 1}
            value={word}
            wrapClass='code red inline-flex items-center mr3 mb3'
          />
        );
      })}
    </>
  );
}
