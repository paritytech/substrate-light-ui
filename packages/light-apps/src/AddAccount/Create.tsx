// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Keyring } from '@polkadot/ui-keyring';
import { mnemonicGenerate, mnemonicToSeed, naclKeypairFromSeed } from '@polkadot/util-crypto';
import { AppContext, handler } from '@substrate/ui-common';
import { AddressSummary, ErrorText, FadedText, Input, Margin, MnemonicSegment, NavButton, SizeType, Stacked, StyledLinkButton, SubHeader, WrapperDiv, WithSpaceAround } from '@substrate/ui-components';
import FileSaver from 'file-saver';
import { Either, left, right } from 'fp-ts/lib/Either';
import { none, Option, some } from 'fp-ts/lib/Option';
import React, { useContext, useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';

interface Props extends RouteComponentProps {
  identiconSize?: SizeType;
}
interface UserInput {
  mnemonic: string;
  name: string;
  password: string;
  rewritePhrase: string;
}
interface UserInputError extends Partial<UserInput> { }

type Steps = 'create' | 'rewrite';

/**
 * Derive public address from mnemonic key
 */
function generateAddressFromMnemonic (keyring: Keyring, mnemonic: string): string {
  const keypair = naclKeypairFromSeed(mnemonicToSeed(mnemonic));

  return keyring.encodeAddress(
    keypair.publicKey
  );
}

/**
 * Validate user inputs
 */
function validate (values: UserInput): Either<UserInputError, UserInput> {
  const errors = {} as UserInputError;

  (['name', 'password', 'rewritePhrase'] as (keyof UserInput)[])
    .filter((key) => !values[key])
    .forEach((key) => {
      errors[key] = `Field "${key}" cannot be empty`;
    });

  if (values.mnemonic !== values.rewritePhrase) {
    errors.rewritePhrase = 'Mnemonic does not match rewrite';
  }

  return Object.keys(errors).length ? left(errors) : right(values);
}

export function Create (props: Props) {
  const { keyring } = useContext(AppContext);

  const [error, setError] = useState<Option<string>>(none);
  const [mnemonic, setMnemonic] = useState(mnemonicGenerate());
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [rewritePhrase, setRewritePhrase] = useState('');
  const [step, setStep] = useState<Steps>('create');

  const address = generateAddressFromMnemonic(keyring, mnemonic);
  const validation = validate({ mnemonic, name, password, rewritePhrase });

  const createNewAccount = () => {
    validation.fold(
      (err) => { onError(err); },
      (values) => {
        // keyring.createFromUri(`${phrase.trim()}${derivePath}`, {}, pairType).address;
        // keyring.addUri(`${seed}${derivePath}`, password, { name, tags }, pairType);
        const result = keyring.addUri(values.mnemonic.trim(), values.password, { name: values.name });

        const json = result.json;
        const blob = new Blob([JSON.stringify(json)], { type: 'application/json; charset=utf-8' });

        FileSaver.saveAs(blob, `${values.name}-${result.pair.address}.json`);
      }
    );
  };

  const onError = (err: UserInputError) => {
    setError(some(Object.values(err)[0]));
  };

  const goToNextStep = () => {
    setError(none);

    validation.fold(
      (err) => (err.name || err.password) ? onError(err) : setStep('rewrite'),
      () => setStep('rewrite')
    );
  };

  const goToPreviousStep = () => {
    setError(none);
    setStep('create');
  };

  return (
    <Stacked>
      <AddressSummary address={address} name={name} size={props.identiconSize} />
      <Margin top />
      {step === 'create'
        ? renderCreateStep({ mnemonic, name, password }, { setMnemonic, setName, setPassword }, goToNextStep)
        : renderRewriteStep({ mnemonic, rewritePhrase }, { setRewritePhrase }, createNewAccount, goToPreviousStep)
      }
      {renderError(error)}
    </Stacked>
  );
}

function renderCreateStep (
  values: {
    mnemonic: string,
    name: string,
    password: string
  },
  setters: {
    setMnemonic: React.Dispatch<React.SetStateAction<string>>,
    setName: React.Dispatch<React.SetStateAction<string>>,
    setPassword: React.Dispatch<React.SetStateAction<string>>
  },
  goToNextStep: () => void
) {
  const { mnemonic, name, password } = values;
  const { setMnemonic, setName, setPassword } = setters;

  return (
    <React.Fragment>
      <Stacked>
        <SubHeader> Create from the following mnemonic phrase </SubHeader>
        <Stacked>
          <MnemonicSegment onClick={() => setMnemonic(mnemonicGenerate())} mnemonic={mnemonic} />
          <WrapperDiv margin='0'>
            {renderSetName(name, setName)}
            <Margin top />
            {renderSetPassword(password, setPassword)}
          </WrapperDiv>
        </Stacked>
        <NavButton onClick={goToNextStep}> Next </NavButton>
      </Stacked>
    </React.Fragment>
  );
}

function renderError (error: Option<string>) {
  return error.fold(null, (err) => <ErrorText>{err}</ErrorText>);
}

function renderRewriteStep (
  values: {
    mnemonic: string,
    rewritePhrase: string
  },
  setters: {
    setRewritePhrase: React.Dispatch<React.SetStateAction<string>>
  },
  createNewAccount: () => void,
  goToPreviousStep: () => void
) {
  const { rewritePhrase } = values;
  const { setRewritePhrase } = setters;

  return (
    <React.Fragment>
      <Stacked>
        <SubHeader> Copy Your Mnemonic Somewhere Safe </SubHeader>
        <FadedText> If someone gets hold of this mnemonic they could drain your account</FadedText>
        <Margin top />
        <FadedText> Rewrite Mnemonic Below </FadedText>
        <Input
          autoFocus
          fluid
          onChange={handler(setRewritePhrase)}
          type='text'
          value={rewritePhrase} />
        <WithSpaceAround>
          <Stacked>
            <StyledLinkButton onClick={goToPreviousStep}> Back </StyledLinkButton>
            <Margin top />
            <NavButton onClick={createNewAccount}> Save </NavButton>
          </Stacked>
        </WithSpaceAround>
      </Stacked>
    </React.Fragment>
  );
}

function renderSetName (name: string, setName: React.Dispatch<React.SetStateAction<string>>) {
  return (
    <WithSpaceAround>
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
    </WithSpaceAround>
  );
}

function renderSetPassword (password: string, setPassword: React.Dispatch<React.SetStateAction<string>>) {
  return (
    <WithSpaceAround>
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
    </WithSpaceAround>
  );
}
