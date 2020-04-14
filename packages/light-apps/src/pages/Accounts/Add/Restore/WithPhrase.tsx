// Copyright 2018-2020 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { handler } from '@substrate/context';
import {
  ErrorText,
  Input,
  Margin,
  NavButton,
  Stacked,
  SubHeader,
  WrapperDiv,
} from '@substrate/ui-components';
import React, { useContext, useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';

import { InjectedContext } from '../../../../components/context';
import { assertIsDefined } from '../../../../util/assert';
import { AddAccountStepMeta } from '../shared/StepMeta';

type Props = RouteComponentProps;

export function RestoreWithPhrase(props: Props): React.ReactElement {
  const { history } = props;

  const { messaging } = useContext(InjectedContext);

  const [error, setError] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [recoveryPhrase, setRecoveryPhrase] = useState('');

  const handleSubmit = (): void => {
    if (!name || !password || !recoveryPhrase) {
      return setError('Please fill in all fields.');
    }

    assertIsDefined(
      messaging,
      "We wouldn't be restoring via phrase if there was no injected messaging. qed."
    );

    messaging
      .createAccountSuri(name, password, recoveryPhrase)
      .then(() => history.push('/'))
      .catch(console.error);
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <ErrorText>{error}</ErrorText>}
      <Stacked justifyContent='space-between'>
        <SubHeader>
          Import Account from Mnemonic Recovery Phrase
        </SubHeader>
        <WrapperDiv>
          <SubHeader>Phrase</SubHeader>
          <Input
            fluid
            onChange={handler(setRecoveryPhrase)}
            size='huge'
            type='text'
            value={recoveryPhrase}
          />
          <Margin top />
          <AddAccountStepMeta
            name={name}
            password={password}
            setError={setError}
            setName={setName}
            setPassword={setPassword}
          />
        </WrapperDiv>
        <Margin top />
        <NavButton value='Restore' />
      </Stacked>
    </form>
  );
}
