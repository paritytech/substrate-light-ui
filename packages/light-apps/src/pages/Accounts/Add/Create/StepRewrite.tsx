// Copyright 2018-2020 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { handler } from '@substrate/context';
import {
  Header,
  Layout,
  Margin,
  Menu,
  MnemonicRandomWord,
  MnemonicRewriteParts,
  NavButton,
  Paragraph,
} from '@substrate/ui-components';
import React, { useCallback, useState } from 'react';

/**
 * Fischer Yates shuffle numbers between 0 and @max.
 *
 * @param max highest number the random number should be.
 */
function getRandomInts(max: number): number[] {
  const scratch = [];

  // populate with the range of possible numbers
  for (let i = 1; i <= max; ++i) {
    scratch.push(i);
  }

  let temp;
  let randIndex;

  for (let i = max - 1; i >= 0; i -= 1) {
    randIndex = Math.floor(Math.random() * Math.floor(i));
    temp = scratch[i];
    scratch[i] = scratch[randIndex];
    scratch[randIndex] = temp;
  }

  return scratch;
}

/**
 * Pick random four from the mnemonic to make sure user copied it right
 */
export function randomlyPickFour(mnemonic: string): MnemonicRandomWord[] {
  const phraseArray = mnemonic.split(' ');
  const ceil = phraseArray.length;

  const [first, second, third, fourth] = getRandomInts(ceil);

  const randomFour = [
    { position: first, word: phraseArray[first - 1] },
    { position: second, word: phraseArray[second - 1] },
    { position: third, word: phraseArray[third - 1] },
    { position: fourth, word: phraseArray[fourth - 1] },
  ];

  return randomFour;
}

interface Props {
  goToNextStep: () => void;
  goToPreviousStep: () => void;
  randomFourWords: MnemonicRandomWord[];
  setError: React.Dispatch<React.SetStateAction<string>>;
}

export function AddAccountStepRewrite(props: Props): React.ReactElement {
  const { goToNextStep, goToPreviousStep, randomFourWords, setError } = props;
  const [firstWord, setFirstWord] = useState('');
  const [secondWord, setSecondWord] = useState('');
  const [thirdWord, setThirdWord] = useState('');
  const [fourthWord, setFourthWord] = useState('');

  const handleGoToNextStep = useCallback(() => {
    if (!firstWord || !secondWord || !thirdWord || !fourthWord) {
      return setError('Please fill in all fields.');
    }

    if (
      !(
        firstWord === randomFourWords[0].word &&
        secondWord === randomFourWords[1].word &&
        thirdWord === randomFourWords[2].word &&
        fourthWord === randomFourWords[3].word
      )
    ) {
      return setError(
        'It seems you did not copy all the words properly. Please double check your inputs and try again.'
      );
    }

    goToNextStep();
  }, [
    firstWord,
    fourthWord,
    goToNextStep,
    randomFourWords,
    secondWord,
    setError,
    thirdWord,
  ]);

  return (
    <>
      <Menu borderless shadow={false} tabs size='tiny'>
        <Menu.Item active>Rewrite Mnemonic Below</Menu.Item>
      </Menu>
      <Layout framed>
        <MnemonicRewriteParts
          randomFourWords={randomFourWords}
          firstWord={firstWord}
          secondWord={secondWord}
          thirdWord={thirdWord}
          fourthWord={fourthWord}
          handleSetFirstWord={handler(setFirstWord)}
          handleSetSecondWord={handler(setSecondWord)}
          handleSetThirdWord={handler(setThirdWord)}
          handleSetFourthWord={handler(setFourthWord)}
        />
      </Layout>
      <Margin top />
      <Header as='h4' wrapClass='mt3'>
        Copy your Mnemonic Somewhere Safe
      </Header>
      <Paragraph faded>
        If someone gets hold of this mnemonic they could drain your account
      </Paragraph>
      <Margin top='large' />
      <Layout className='justify-between mt4'>
        <NavButton negative onClick={goToPreviousStep}>
          Back
        </NavButton>
        <NavButton onClick={handleGoToNextStep}>Next</NavButton>
        <NavButton className='o-0'>Back</NavButton>
      </Layout>
    </>
  );
}
