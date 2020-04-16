// Copyright 2018-2020 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { handler } from '@substrate/context';
import {
  ErrorText,
  FramedBlock,
  Input,
  Margin,
  Menu,
  NavButton,
  Stacked,
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
      <Stacked>
        <Menu borderless shadow={false} tabs size='tiny'>
          <Menu.Item active>Mnemonic Recovery Phrase</Menu.Item>
        </Menu>
        <FramedBlock>
          <Input
            fluid
            onChange={handler(setRecoveryPhrase)}
            type='text'
            value={recoveryPhrase}
          />
        </FramedBlock>
        <Margin top />
        <AddAccountStepMeta
          name={name}
          password={password}
          setError={setError}
          setName={setName}
          setPassword={setPassword}
        />
        <Margin top />
        <NavButton value='Restore' wrapClass='flex w-100 justify-around' />
      </Stacked>
    </form>
  );
}
