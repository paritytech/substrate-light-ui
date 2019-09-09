// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AppContext, handler } from '@substrate/ui-common';
import { ErrorText, Input, Margin, NavButton, Stacked, SubHeader, WrapperDiv } from '@substrate/ui-components';

import { Either, left, right, tryCatch2v } from 'fp-ts/lib/Either';
import { none, Option, some } from 'fp-ts/lib/Option';
import React, { useContext, useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';

interface Props extends RouteComponentProps { }
interface UserInput {
  name: string;
  password: string;
  recoveryPhrase: string;
}
interface UserInputError extends Partial<UserInput> {
  createAccount?: string;
}

/**
 * Validate user inputs
 */
function validate (values: UserInput): Either<UserInputError, UserInput> {
  const errors = {} as UserInputError;

  (['name', 'password', 'recoveryPhrase'] as (keyof UserInput)[])
    .filter((key) => !values[key])
    .forEach((key) => {
      errors[key] = `Field "${key}" cannot be empty`;
    });

  if (values.recoveryPhrase.split(' ').length !== 12) {
    errors.recoveryPhrase = 'Invalid phrase. Please check it and try again.';
  }

  return Object.keys(errors).length ? left(errors) : right(values);
}

export function ImportWithPhrase (props: Props) {
  const { history } = props;
  const { keyring } = useContext(AppContext);

  const [error, setError] = useState<Option<string>>(none);
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [recoveryPhrase, setRecoveryPhrase] = useState('');

  const handleUnlockWithPhrase = () => {
    validate({ name, password, recoveryPhrase })
      .chain(({ name, password, recoveryPhrase }) => tryCatch2v(
        () => {
          // This is inside tryCatch, because it might fail
          keyring.createFromUri(recoveryPhrase.trim(), {}, 'sr25519');
        },
        (err) => ({ createAccount: (err as Error).message })
      ))
      .fold(
        (err) => setError(some(Object.values(err)[0])), // If there are errors, only show the 1st one
        () => history.push('/')
      );
  };

  return (
    <Stacked justifyContent='space-between'>
      <SubHeader> Import Account from Mnemonic Recovery Phrase </SubHeader>
      <WrapperDiv width='75%'>
        <Input
          fluid
          label='Phrase'
          onChange={handler(setRecoveryPhrase)}
          type='text'
          value={recoveryPhrase} />
        <Margin top />
        <Input
          fluid
          label='Name'
          onChange={handler(setName)}
          type='text'
          value={name} />
        <Margin top />
        <Input
          fluid
          label='Password'
          onChange={handler(setPassword)}
          type='password'
          value={password} />
      </WrapperDiv>
      <Margin top />
      <NavButton onClick={handleUnlockWithPhrase} value='Restore' />
      {renderError(error)}
    </Stacked>
  );
}

function renderError (error: Option<string>) {
  return error.fold(null, (err) => <ErrorText>{err}</ErrorText>);
}
