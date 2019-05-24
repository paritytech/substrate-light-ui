// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AppContext, handler } from '@substrate/ui-common';
import { ErrorText, Input, Margin, Modal, NavButton, Stacked, WrapperDiv } from '@substrate/ui-components';
import { none, Option, some } from 'fp-ts/lib/Option';
import React, { useContext, useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';

interface Props extends RouteComponentProps { }

export function ImportWithPhrase (props: Props) {
  const { history } = props;
  const { keyring } = useContext(AppContext);

  const [error, setError] = useState<Option<string>>(none);
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [recoveryPhrase, setRecoveryPhrase] = useState('');

  const handleUnlockWithPhrase = () => {
    try {
      if (!password) {
        throw new Error('Please enter the password you used to create this account');
      }

      if (recoveryPhrase && recoveryPhrase.split(' ').length === 12) {
        const meta = { name: name };

        let pair = keyring.createAccountMnemonic(recoveryPhrase, password, meta);

        history.push(`identity/${pair.address()}`);
      } else {
        throw new Error('Invalid phrase. Please check it and try again.');
      }
    } catch (e) {
      setError(some(e.message));
    }
  };

  return (
    <Stacked justifyContent='space-between'>
      <Modal.SubHeader> Import Account from Mnemonic Recovery Phrase </Modal.SubHeader>
      <WrapperDiv width='40rem'>
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
