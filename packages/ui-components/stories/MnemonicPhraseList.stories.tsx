// Copyright 2018-2020 @paritytech/Nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { text, withKnobs } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';
import React from 'react';

import { MnemonicPhraseList, MnemonicRewriteParts } from '../src';
import { withTheme } from './customDecorators';

// TODO: MnemonicRewriteParts Props

const SAMPLE_PHRASE =
  'glass decrease speak taxi pencil spice carpet danger planet will cage park';
const SAMPLE_HANDLE_WORD = ({
  target: { value },
}: React.ChangeEvent<HTMLInputElement>): void => {
  console.log(value);
};
export const NewMnemonicStory = (): JSX.Element => {
  return <MnemonicPhraseList phrase={text('mnemonic phrase', SAMPLE_PHRASE)} />;
};

export const RewriteMnemonicStory = (): JSX.Element => {
  return (
    <MnemonicRewriteParts
      firstWord=''
      secondWord=''
      thirdWord=''
      fourthWord=''
      randomFourWords={[
        { position: 1, word: '' },
        { position: 12, word: '' },
        { position: 3, word: '' },
        { position: 8, word: '' },
      ]}
      handleSetFirstWord={SAMPLE_HANDLE_WORD}
      handleSetSecondWord={SAMPLE_HANDLE_WORD}
      handleSetThirdWord={SAMPLE_HANDLE_WORD}
      handleSetFourthWord={SAMPLE_HANDLE_WORD}
    />
  );
};

storiesOf('Mnemonic', module)
  .addDecorator(withKnobs)
  .addDecorator(withTheme)
  .add('MnemonicPhraseList', () => (
    <MnemonicPhraseList phrase={text('mnemonic phrase', SAMPLE_PHRASE)} />
  ))
  .add('MnemonicRewriteParts', () => <RewriteMnemonicStory />);
