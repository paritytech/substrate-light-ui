// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Keyring } from '@polkadot/ui-keyring';
import { mnemonicGenerate, mnemonicToSeed, naclKeypairFromSeed } from '@polkadot/util-crypto';
import { AppContext, handler } from '@substrate/ui-common';
import { AddressSummary, ErrorText, FadedText, Input, Margin, MnemonicSegment, NavButton, Stacked, StyledLinkButton, SubHeader, WrapperDiv, WithSpaceAround } from '@substrate/ui-components';
import FileSaver from 'file-saver';
import { Either, left, right } from 'fp-ts/lib/Either';
import { none, Option, some } from 'fp-ts/lib/Option';
import React, { useContext, useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';

interface Props extends RouteComponentProps { }
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
    const { history } = props;

    validation.fold(
      (err) => { onError(err); },
      (values) => {
        const pair = keyring.createAccountMnemonic(values.mnemonic, values.password, { name: values.name });

        const json = pair.toJson(values.password);
        const blob = new Blob([JSON.stringify(json)], { type: 'application/json; charset=utf-8' });

        FileSaver.saveAs(blob, `${values.name}-${pair.address()}.json`);

        history.push(`/transfer/${pair.address()}`);
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
      <AddressSummary address={address} name={name} />
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
        <MnemonicSegment onClick={() => setMnemonic(mnemonicGenerate())} mnemonic={mnemonic} />
        <Margin top />
        <Stacked>
          {renderSetName(name, setName)}
          <Margin top />
          {renderSetPassword(password, setPassword)}
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
  const { mnemonic, rewritePhrase } = values;
  const { setRewritePhrase } = setters;

  return (
    <React.Fragment>
      <Stacked>
        <SubHeader> Copy Your Mnemonic Somewhere Safe </SubHeader>
        <FadedText> If someone gets hold of this mnemonic they could drain your account</FadedText>
        <MnemonicSegment mnemonic={mnemonic} />
        <Margin top />
        <FadedText> Rewrite Mnemonic Below </FadedText>
        <WrapperDiv>
          <Input
            autoFocus
            fluid
            onChange={handler(setRewritePhrase)}
            type='text'
            value={rewritePhrase} />
        </WrapperDiv>
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
    <Stacked>
      <SubHeader> Give it a name </SubHeader>
      <WrapperDiv>
        <Input
          autoFocus
          fluid
          min={1}
          onChange={handler(setName)}
          type='text'
          value={name}
        />
      </WrapperDiv>
    </Stacked>
  );
}

function renderSetPassword (password: string, setPassword: React.Dispatch<React.SetStateAction<string>>) {
  return (
    <Stacked>
      <SubHeader> Encrypt it with a passphrase </SubHeader>
      <WrapperDiv>
        <Input
          fluid
          min={8}
          onChange={handler(setPassword)}
          type='password'
          value={password}
        />
      </WrapperDiv>
    </Stacked>
  );
}
