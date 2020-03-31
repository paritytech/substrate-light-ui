// Copyright 2018-2020 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { mnemonicGenerate } from '@polkadot/util-crypto';
import { ApiContext } from '@substrate/context';
import {
  AddressSummary,
  Margin,
  SizeType,
  Stacked,
} from '@substrate/ui-components';
import { none, Option, some } from 'fp-ts/lib/Option';
import React, { useContext, useEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';

import { createAccountSuri } from '../../../messaging';
import { PhrasePartialRewriteError, Steps, UserInputError } from '../types';
import { getRandomInts, validateMeta, validateRewrite } from '../util';
import {
  renderCopyStep,
  renderErrors,
  renderMetaStep,
  renderRewriteStep,
} from './subComponents';

interface Props extends RouteComponentProps {
  identiconSize?: SizeType;
}

function randomlyPickFour(phrase: string): Array<Array<string>> {
  const phraseArray = phrase.split(' ');
  const ceil = phraseArray.length;

  const [first, second, third, fourth] = getRandomInts(ceil);

  const randomFour = [
    [first.toString(), phraseArray[first - 1]],
    [second.toString(), phraseArray[second - 1]],
    [third.toString(), phraseArray[third - 1]],
    [fourth.toString(), phraseArray[fourth - 1]],
  ];

  return randomFour;
}

export function Create(props: Props): React.ReactElement {
  const { location, history } = props;

  const { api } = useContext(ApiContext);

  const [address, setAddress] = useState<string>();
  const [errors, setErrors] = useState<Option<Array<string>>>(none);
  const [mnemonic] = useState(mnemonicGenerate());
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [step, setStep] = useState<Steps>('copy');

  const [firstWord, setFirstWord] = useState('');
  const [secondWord, setSecondWord] = useState('');
  const [thirdWord, setThirdWord] = useState('');
  const [fourthWord, setFourthWord] = useState('');

  const [randomFourWords, setRandomFourWords] = useState<string[][]>([]);

  useEffect(() => {
    // pick random four from the mnemonic to make sure user copied it right
    const randomFour = randomlyPickFour(mnemonic);

    setRandomFourWords(randomFour);
  }, [location, mnemonic]);

  const validation = validateMeta({ name, password }, step);

  const handleSetFirstWord = ({
    target: { value },
  }: React.ChangeEvent<HTMLInputElement>): void => {
    setFirstWord(value);
  };

  const handleSetSecondWord = ({
    target: { value },
  }: React.ChangeEvent<HTMLInputElement>): void => {
    setSecondWord(value);
  };
  const handleSetThirdWord = ({
    target: { value },
  }: React.ChangeEvent<HTMLInputElement>): void => {
    setThirdWord(value);
  };

  const handleSetFourthWord = ({
    target: { value },
  }: React.ChangeEvent<HTMLInputElement>): void => {
    setFourthWord(value);
  };

  const onError = (err: UserInputError | PhrasePartialRewriteError): void => {
    setErrors(some(Object.values(err)));
  };

  const createNewAccount = (): void => {
    validation.fold(
      (err) => {
        onError(err);
      },
      (values) => {
        createAccountSuri(values.name, values.password, mnemonic)
          .then(() => history.push('/'))
          .catch(console.error);
      }
    );
  };

  const goToNextStep = (): void => {
    setErrors(none);

    if (step === 'copy') {
      validateMeta({ name, password }, step).fold(
        (err) => onError(err),
        () => setStep('rewrite')
      );
    }

    if (step === 'rewrite') {
      validateRewrite(
        { firstWord, secondWord, thirdWord, fourthWord },
        randomFourWords
      ).fold(
        (err) => onError(err),
        () => setStep('meta')
      );
    }
  };

  const goToPreviousStep = (): void => {
    setErrors(none);

    if (step === 'rewrite') {
      setStep('copy');
    }

    if (step === 'meta') {
      setStep('rewrite');
    }
  };

  return (
    <Stacked>
      <AddressSummary
        address={address}
        api={api}
        name={name}
        size='small'
        orientation='vertical'
      />
      <Margin top />
      {step === 'copy'
        ? renderCopyStep({ mnemonic }, { goToNextStep })
        : step === 'rewrite'
        ? renderRewriteStep(
            { randomFourWords, firstWord, secondWord, thirdWord, fourthWord },
            {
              handleSetFirstWord,
              handleSetSecondWord,
              handleSetThirdWord,
              handleSetFourthWord,
              goToPreviousStep,
              goToNextStep,
            }
          )
        : renderMetaStep(
            { name, password },
            {
              setName,
              setPassword,
              createNewAccount,
              goToPreviousStep,
            }
          )}
      {renderErrors(errors)}
    </Stacked>
  );
}
