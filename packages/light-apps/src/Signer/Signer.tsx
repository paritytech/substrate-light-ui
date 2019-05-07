// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { KeyringPair } from '@polkadot/keyring/types';
import InputAddress from '@polkadot/ui-app/InputAddress';
import { TxQueueContext } from '@substrate/ui-common';
import { ErrorText, Form, Input, Modal, Stacked } from '@substrate/ui-components';
import { Either, left, right } from 'fp-ts/lib/Either';
import React, { useContext, useState } from 'react';

function unlockAccount (keyringPair: KeyringPair, password: string): Either<Error, KeyringPair> {
  if (!keyringPair.isLocked()) {
    return right(keyringPair);
  }

  try {
    keyringPair.decodePkcs8(password);
  } catch (err) {
    return left(err);
  }

  return right(keyringPair);
}

export function Signer () {
  const { clear, submit, txQueue } = useContext(TxQueueContext);
  const [inputPassword, setInputPassword] = useState('');
  const [error, setError] = useState('');

  const pendingTx = txQueue.find(({ status: { isAskingForConfirm } }) => isAskingForConfirm);

  if (!pendingTx) {
    return null;
  }

  const { senderPair } = pendingTx.details;

  const handlePasswordChange = ({ target: { value } }: React.ChangeEvent<HTMLInputElement>) => {
    setError('');
    setInputPassword(value);
  };

  return (
    <Modal
      as={Form}
      onSubmit={() => {
        unlockAccount(senderPair, inputPassword).fold(
          (err) => setError(err.message),
          () => submit(pendingTx.id)
        );
      }}
      open
    >
      <React.Fragment>
        <Modal.Header>Confirm transaction</Modal.Header>
        <Modal.Content>
          <Stacked>
            <InputAddress
              isDisabled
              type='account'
              value={senderPair.address()}
              withLabel={false}
            />
            {senderPair.isLocked() && <Input
              fluid
              label='Password'
              onChange={handlePasswordChange}
              type='password'
              value={inputPassword}
            />}
            {error && <ErrorText>{error}</ErrorText>}
          </Stacked>
        </Modal.Content>
        <Modal.Actions>
          <button onClick={clear} type='button'>
            Cancel
        </button>
          <button disabled={senderPair.isLocked() && !inputPassword}>
            OK
        </button>
        </Modal.Actions>
      </React.Fragment>
    </Modal>
  );
}
