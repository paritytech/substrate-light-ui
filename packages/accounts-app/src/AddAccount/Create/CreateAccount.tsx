// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { mnemonicGenerate } from '@polkadot/util-crypto';
import { AddressSummary, Margin, SizeType, Stacked } from '@substrate/ui-components';
import FileSaver from 'file-saver';
import { none, Option, some } from 'fp-ts/lib/Option';
import React, { useContext, useEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';

import { KeyringContext } from '../../KeyringContext';
import { PhrasePartialRewriteError, Steps, TagOptions, Tags, UserInputError } from '../types';
import { generateAddressFromMnemonic, getRandomInts, validateMeta, validateRewrite } from '../util';
import { renderCopyStep, renderErrors, renderMetaStep, renderRewriteStep } from './subComponents';

interface Props extends RouteComponentProps {
  identiconSize?: SizeType;
}

function randomlyPickFour(phrase: string): Array<Array<string>> {
  const phraseArray = phrase.split(' ');
  const ceil = phraseArray.length;

  const [first, second, third, fourth] = getRandomInts(ceil);

  const randomFour = [
    [first, phraseArray[first - 1]],
    [second, phraseArray[second - 1]],
    [third, phraseArray[third - 1]],
    [fourth, phraseArray[fourth - 1]],
  ] as Array<Array<string>>;

  return randomFour;
}

export function Create(props: Props): React.ReactElement {
  const { location } = props;

  const { keyring, keyringReady } = useContext(KeyringContext);

  const [address, setAddress] = useState();
  const [errors, setErrors] = useState<Option<Array<string>>>(none);
  const [mnemonic] = useState(mnemonicGenerate());
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [step, setStep] = useState<Steps>('copy');

  const [tagOptions, setTagOptions] = useState<TagOptions>([
    { key: '0', text: 'stash', value: 'Stash' },
    { key: '1', text: 'controller', value: 'Controller' },
  ]);
  const [tags, setTags] = useState<Tags>([]);

  const [firstWord, setFirstWord] = useState();
  const [secondWord, setSecondWord] = useState();
  const [thirdWord, setThirdWord] = useState();
  const [fourthWord, setFourthWord] = useState();

  const [randomFourWords, setRandomFourWords] = useState();
  const [whichAccount, setWhichAccount] = useState();

  useEffect(() => {
    if (keyringReady) {
      const _address = generateAddressFromMnemonic(keyring, mnemonic);
      setAddress(_address);
    }
  }, [keyring, keyringReady, mnemonic]);

  useEffect(() => {
    // pick random four from the mnemonic to make sure user copied it right
    const randomFour = randomlyPickFour(mnemonic);
    const whichAccount = location.pathname.split('/')[2];

    if (whichAccount === 'stash' || whichAccount === 'controller') {
      setWhichAccount(whichAccount);
    }

    setRandomFourWords(randomFour);
  }, [location, mnemonic]);

  const validation = validateMeta({ name, password, tags }, step, whichAccount);

  const handleSetFirstWord = ({ target: { value } }: React.ChangeEvent<HTMLInputElement>): void => {
    setFirstWord(value);
  };

  const handleSetSecondWord = ({ target: { value } }: React.ChangeEvent<HTMLInputElement>): void => {
    setSecondWord(value);
  };
  const handleSetThirdWord = ({ target: { value } }: React.ChangeEvent<HTMLInputElement>): void => {
    setThirdWord(value);
  };

  const handleSetFourthWord = ({ target: { value } }: React.ChangeEvent<HTMLInputElement>): void => {
    setFourthWord(value);
  };

  const onError = (err: UserInputError | PhrasePartialRewriteError): void => {
    setErrors(some(Object.values(err)));
  };

  const createNewAccount = (): void => {
    validation.fold(
      err => {
        onError(err);
      },
      values => {
        // keyring.createFromUri(`${phrase.trim()}${derivePath}`, {}, pairType).address;
        // keyring.addUri(`${seed}${derivePath}`, password, { name, tags }, pairType);
        const result = keyring.addUri(mnemonic.trim(), values.password, {
          name: values.name,
          tags: values.tags,
        });

        const json = result.json;
        const blob = new Blob([JSON.stringify(json)], { type: 'application/json; charset=utf-8' });

        FileSaver.saveAs(blob, `${values.name}-${result.pair.address}.json`);
      }
    );
  };

  const goToNextStep = (): void => {
    setErrors(none);

    if (step === 'copy') {
      validateMeta({ name, password, tags }, step, whichAccount).fold(
        err => onError(err),
        () => setStep('rewrite')
      );
    }

    if (step === 'rewrite') {
      validateRewrite({ firstWord, secondWord, thirdWord, fourthWord }, randomFourWords).fold(
        err => onError(err),
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

  const handleOnChange = (_event: React.SyntheticEvent, { value }: any): void => {
    setTags(value);
  };

  const handleAddTag = (_event: React.SyntheticEvent, { value }: any): void => {
    setTagOptions([...tagOptions, { key: value, text: value, value }]);
  };

  return (
    <Stacked>
      {keyringReady && <AddressSummary address={address} name={name} size='small' />}
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
            { name, password, tags, tagOptions, whichAccount },
            { setName, setPassword, handleAddTag, handleOnChange, createNewAccount, goToPreviousStep }
          )}
      {renderErrors(errors)}
    </Stacked>
  );
}
