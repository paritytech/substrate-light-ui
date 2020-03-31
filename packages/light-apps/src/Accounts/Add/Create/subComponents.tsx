import { handler } from '@substrate/context';
import {
  ErrorText,
  FadedText,
  Input,
  Margin,
  MnemonicPhraseList,
  MnemonicRewriteParts,
  NavButton,
  Stacked,
  StackedHorizontal,
  StyledLinkButton,
  StyledNavButton,
  SubHeader,
  WithSpaceAround,
  WrapperDiv,
} from '@substrate/ui-components';
import { Option } from 'fp-ts/lib/Option';
import React from 'react';

export function renderSetName(
  name: string,
  setName: React.Dispatch<React.SetStateAction<string>>
): React.ReactElement {
  return (
    <Stacked>
      <SubHeader noMargin>Give it a name</SubHeader>
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

export function renderSetPassword(
  password: string,
  setPassword: React.Dispatch<React.SetStateAction<string>>
): React.ReactElement {
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

export function renderErrors(
  errors: Option<Array<string>>
): React.ReactElement | null {
  return errors.fold(null, (errStrings) => (
    <>
      {errStrings.map((err) => (
        <ErrorText key={err}>{err}</ErrorText>
      ))}
    </>
  ));
}

export function renderRewriteStep(
  values: {
    firstWord: string;
    secondWord: string;
    thirdWord: string;
    fourthWord: string;
    randomFourWords: Array<Array<string>>;
  },
  setters: {
    handleSetFirstWord: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleSetSecondWord: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleSetThirdWord: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleSetFourthWord: (e: React.ChangeEvent<HTMLInputElement>) => void;
    goToPreviousStep: () => void;
    goToNextStep: () => void;
  }
): React.ReactElement {
  const {
    randomFourWords,
    firstWord,
    secondWord,
    thirdWord,
    fourthWord,
  } = values;
  const {
    goToNextStep,
    goToPreviousStep,
    handleSetFirstWord,
    handleSetSecondWord,
    handleSetThirdWord,
    handleSetFourthWord,
  } = setters;

  return (
    <Stacked>
      <SubHeader>Copy Your Mnemonic Somewhere Safe</SubHeader>
      <FadedText>
        If someone gets hold of this mnemonic they could drain your account
      </FadedText>
      <Margin top />
      <FadedText>Rewrite Mnemonic Below</FadedText>
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
          <StyledLinkButton onClick={goToPreviousStep}>Back</StyledLinkButton>
          <StyledNavButton onClick={goToNextStep}>Next</StyledNavButton>
        </StackedHorizontal>
      </WithSpaceAround>
    </Stacked>
  );
}

export function renderMetaStep(
  values: {
    name: string;
    password: string;
  },
  setters: {
    setName: React.Dispatch<React.SetStateAction<string>>;
    setPassword: React.Dispatch<React.SetStateAction<string>>;
    createNewAccount: () => void;
    goToPreviousStep: () => void;
  }
): React.ReactElement {
  const { name, password } = values;
  const { setName, setPassword } = setters;

  return (
    <WrapperDiv margin='0'>
      {renderSetName(name, setName)}
      <Margin top='small' />
      {renderSetPassword(password, setPassword)}
    </WrapperDiv>
  );
}

export function renderCopyStep(
  values: {
    mnemonic: string;
  },
  setters: {
    goToNextStep: () => void;
  }
): React.ReactElement {
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
      <SubHeader>Copy the following mnemonic phrase</SubHeader>
      <FadedText>
        Your private key will be generated from this phrase. Anyone with access
        to this phrase can have full control your funds so make sure to keep it
        a secure and secret.
      </FadedText>
      <MnemonicPhraseList phrase={mnemonic} />
      <NavButton onClick={goToNextStep}>Next</NavButton>
    </Stacked>
  );
}
