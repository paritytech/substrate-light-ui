// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { mnemonicGenerate } from '@polkadot/util-crypto';
import { AppContext, handler } from '@substrate/ui-common';
import { AddressSummary, Dropdown, ErrorText, FadedText, Input, Margin, MnemonicPhraseList, MnemonicRewriteParts, NavButton, SizeType, Stacked, StyledLinkButton, SubHeader, WrapperDiv, WithSpaceAround, StyledNavButton, StackedHorizontal } from '@substrate/ui-components';
import FileSaver from 'file-saver';
import { none, Option, some } from 'fp-ts/lib/Option';
import React, { useContext, useEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';

import { Steps, Tags, TagOptions, UserInputError, PhrasePartialRewriteError } from './types';
import { generateAddressFromMnemonic, getRandomInts, validateMeta, validateRewrite } from './util';

interface Props extends RouteComponentProps {
  identiconSize?: SizeType;
}

export function Create (props: Props) {
  const { identiconSize } = props;

  const { keyring } = useContext(AppContext);

  const [errors, setErrors] = useState<Option<Array<string>>>(none);
  const [mnemonic] = useState(mnemonicGenerate());
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [step, setStep] = useState<Steps>('copy');

  const [tagOptions, setTagOptions] = useState<TagOptions>([
    { key: '0', text: 'stash', value: 'Stash' },
    { key: '1', text: 'controller', value: 'Controller' }
  ]);
  const [tags, setTags] = useState<Tags>([]);

  const [firstWord, setFirstWord] = useState();
  const [secondWord, setSecondWord] = useState();
  const [thirdWord, setThirdWord] = useState();
  const [fourthWord, setFourthWord] = useState();

  const [randomFourWords, setRandomFourWords] = useState();

  useEffect(() => {
    // pick random four from the mnemonic to make sure user copied it right
    const randomFour = randomlyPickFour(mnemonic);

    setRandomFourWords(randomFour);
  }, []);

  const address = generateAddressFromMnemonic(keyring, mnemonic);
  const validation = validateMeta({ name, password, tags }, step);

  function randomlyPickFour (phrase: string): Array<Array<string>> {
    const phraseArray = phrase.split(' ');
    const ceil = phraseArray.length;

    const [first, second, third, fourth] = getRandomInts(ceil);

    const randomFour = [
      [first, phraseArray[first - 1]],
      [second, phraseArray[second - 1]],
      [third, phraseArray[third - 1]],
      [fourth, phraseArray[fourth - 1]]
    ] as Array<Array<string>>;

    return randomFour;
  }

  const handleSetFirstWord = ({ target: { value } }: React.ChangeEvent<HTMLInputElement>) => {
    setFirstWord(value);
  };

  const handleSetSecondWord = ({ target: { value } }: React.ChangeEvent<HTMLInputElement>) => {
    setSecondWord(value);
  };
  const handleSetThirdWord = ({ target: { value } }: React.ChangeEvent<HTMLInputElement>) => {
    setThirdWord(value);
  };

  const handleSetFourthWord = ({ target: { value } }: React.ChangeEvent<HTMLInputElement>) => {
    setFourthWord(value);
  };

  const createNewAccount = () => {
    validation.fold(
      (err) => { onError(err); },
      (values) => {
        // keyring.createFromUri(`${phrase.trim()}${derivePath}`, {}, pairType).address;
        // keyring.addUri(`${seed}${derivePath}`, password, { name, tags }, pairType);
        const result = keyring.addUri(mnemonic.trim(), values.password,
          {
            name: values.name,
            tags: values.tags
          });

        const json = result.json;
        const blob = new Blob([JSON.stringify(json)], { type: 'application/json; charset=utf-8' });

        FileSaver.saveAs(blob, `${values.name}-${result.pair.address}.json`);
      }
    );
  };

  const onError = (err: UserInputError | PhrasePartialRewriteError) => {
    setErrors(some(Object.values(err)));
  };

  const goToNextStep = () => {
    setErrors(none);

    if (step === 'copy') {
      validateMeta({ name, password, tags }, step).fold(
        (err) => onError(err),
        () => setStep('rewrite')
      );
    }

    if (step === 'rewrite') {
      validateRewrite({ firstWord, secondWord, thirdWord, fourthWord }, randomFourWords).fold(
        (err) => onError(err),
        () => setStep('meta')
      );
    }
  };

  const goToPreviousStep = () => {
    setErrors(none);
    setStep('copy');
  };

  const handleOnChange = (event: React.SyntheticEvent, { value }: any) => {
    setTags(value);
  };

  const handleAddTag = (e: React.SyntheticEvent, { value }: any) => {
    setTagOptions([...tagOptions, { key: value, text: value, value }]);
  };

  return (
    <Stacked>
      <AddressSummary address={address} name={name} size={identiconSize} />
      <Margin top />
      {step === 'copy'
        ? renderCopyStep({ mnemonic }, { goToNextStep })
        : step === 'rewrite'
          ? renderRewriteStep({ randomFourWords, firstWord, secondWord, thirdWord, fourthWord }, { handleSetFirstWord, handleSetSecondWord, handleSetThirdWord, handleSetFourthWord, goToPreviousStep, goToNextStep })
          : renderMetaStep({ name, password, tags, tagOptions }, { setName, setPassword, handleAddTag, handleOnChange, createNewAccount, goToPreviousStep })
      }
      {renderErrors(errors)}
    </Stacked>
  );
}

function renderMetaStep (
  values: {
    name: string,
    password: string,
    tags: Tags,
    tagOptions: TagOptions
  },
  setters: {
    setName: React.Dispatch<React.SetStateAction<string>>,
    setPassword: React.Dispatch<React.SetStateAction<string>>,
    handleAddTag: (event: React.SyntheticEvent, data: any) => void, // FIXME any
    handleOnChange: (event: React.SyntheticEvent, data: any) => void, // FIXME any
    createNewAccount: () => void,
    goToPreviousStep: () => void
  }) {
  const { name, password, tags, tagOptions } = values;
  const { handleAddTag, handleOnChange, setName, setPassword } = setters;
  const { createNewAccount, goToPreviousStep } = setters;

  const renderSetTags = () => {
    return (
      <Stacked>
        <SubHeader noMargin>Add Tags:</SubHeader>
        <Dropdown
          allowAdditions
          closeOnChange
          fluid
          multiple
          onAddItem={handleAddTag}
          onChange={handleOnChange}
          options={tagOptions}
          search
          selection
          value={tags} />
        <WithSpaceAround>
        <Stacked>
          <StyledLinkButton onClick={goToPreviousStep}> Back </StyledLinkButton>
          <Margin top />
          <NavButton onClick={createNewAccount}> Save </NavButton>
        </Stacked>
      </WithSpaceAround>
      </Stacked>
    );
  };

  return (
    <WrapperDiv margin='0'>
        {renderSetName(name, setName)}
        <Margin top='small' />
        {renderSetPassword(password, setPassword)}
        <Margin top='small' />
        {renderSetTags()}
      </WrapperDiv>
  );
}

function renderCopyStep (
  values: {
    mnemonic: string
  },
  setters: {
    goToNextStep: () => void
  }
) {
  const { mnemonic } = values;
  const { goToNextStep } = setters;

  /*
    3 steps:
      1 - copy mnemonic
      2 - rewrite mnemonic
      3 - meta and password
  */
  return (
    <Stacked>
      <SubHeader> Copy the following mnemonic phrase</SubHeader>
      <FadedText> Your private key will be generated from this phrase. Anyone with access to this phrase can have full control your funds so make sure to keep it a secure and secret. </FadedText>
      <MnemonicPhraseList phrase={mnemonic} />
      <NavButton onClick={goToNextStep}> Next </NavButton>
    </Stacked>
  );
}

function renderErrors (errors: Option<Array<string>>) {
  return errors.fold(null, errStrings => errStrings.map(err => <ErrorText>{err}</ErrorText>));
}

function renderRewriteStep (
  values: {
    firstWord: string,
    secondWord: string,
    thirdWord: string,
    fourthWord: string,
    randomFourWords: Array<Array<string>>
  },
  setters: {
    handleSetFirstWord: (e: React.ChangeEvent<HTMLInputElement>) => void,
    handleSetSecondWord: (e: React.ChangeEvent<HTMLInputElement>) => void,
    handleSetThirdWord: (e: React.ChangeEvent<HTMLInputElement>) => void,
    handleSetFourthWord: (e: React.ChangeEvent<HTMLInputElement>) => void,
    goToPreviousStep: () => void,
    goToNextStep: () => void
  }
) {
  const { randomFourWords, firstWord, secondWord, thirdWord, fourthWord } = values;
  const { goToNextStep, goToPreviousStep, handleSetFirstWord, handleSetSecondWord, handleSetThirdWord, handleSetFourthWord } = setters;

  return (
    <Stacked>
      <SubHeader> Copy Your Mnemonic Somewhere Safe </SubHeader>
      <FadedText> If someone gets hold of this mnemonic they could drain your account</FadedText>
      <Margin top />
      <FadedText> Rewrite Mnemonic Below </FadedText>
      <MnemonicRewriteParts
        randomFourWords={randomFourWords}
        firstWord={firstWord}
        secondWord={secondWord}
        thirdWord={thirdWord}
        fourthWord={fourthWord}
        handleSetFirstWord={handleSetFirstWord}
        handleSetSecondWord={handleSetSecondWord}
        handleSetThirdWord={handleSetThirdWord}
        handleSetFourthWord={handleSetFourthWord}
         />
      <WithSpaceAround>
        <StackedHorizontal>
          <StyledLinkButton onClick={goToPreviousStep}> Back </StyledLinkButton>
          <StyledNavButton onClick={goToNextStep}>Next</StyledNavButton>
        </StackedHorizontal>
      </WithSpaceAround>
    </Stacked>
  );
}

function renderSetName (name: string, setName: React.Dispatch<React.SetStateAction<string>>) {
  return (
    <Stacked>
      <SubHeader noMargin> Give it a name </SubHeader>
      <Input
        autoFocus
        fluid
        min={1}
        onChange={handler(setName)}
        type='text'
        value={name}
      />
    </Stacked>
  );
}

function renderSetPassword (password: string, setPassword: React.Dispatch<React.SetStateAction<string>>) {
  return (
    <Stacked>
      <SubHeader noMargin> Encrypt it with a passphrase </SubHeader>
        <Input
          fluid
          min={8}
          onChange={handler(setPassword)}
          type='password'
          value={password}
        />
    </Stacked>
  );
}
