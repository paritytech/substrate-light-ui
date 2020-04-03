// Copyright 2018-2020 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { KeyringPair } from '@polkadot/keyring/types';
import { TxQueueContext } from '@substrate/context';
import {
  ErrorText,
  Form,
  Input,
  Margin,
  Modal,
  NavButton,
  Stacked,
  StackedHorizontal,
  StyledLinkButton,
  TxDetails,
  TxSummary,
} from '@substrate/ui-components';
import { Either, left, right } from 'fp-ts/lib/Either';
import React, { useContext, useState } from 'react';

/**
 * Unlock a pair using a password, keeping the secret key in memory.
 *
 * @param keyringPair - The pair to unlock
 * @param password - The password to use to unlock
 */
function unlockAccount(
  keyringPair: KeyringPair,
  password: string
): Either<Error, KeyringPair> {
  if (!keyringPair.isLocked) {
    return right(keyringPair);
  }

  try {
    keyringPair.decodePkcs8(password);
  } catch (err) {
    return left(err);
  }

  return right(keyringPair);
}

export function Signer(): React.ReactElement | null {
  const { clear, submit, txQueue } = useContext(TxQueueContext);
  const [inputPassword, setInputPassword] = useState('');
  const [error, setError] = useState('');

  const pendingTx = txQueue.find(
    ({ status: { isAskingForConfirm } }) => isAskingForConfirm
  );

  if (!pendingTx) {
    return null;
  }

  const { senderPair } = pendingTx.details;

  const handlePasswordChange = ({
    target: { value },
  }: React.ChangeEvent<HTMLInputElement>): void => {
    setError('');
    setInputPassword(value);
  };

  return (
    <Modal
      as={Form}
      onSubmit={(): void => {
        unlockAccount(senderPair, inputPassword).fold(
          (err) => setError(err.message),
          () => submit(pendingTx.id)
        );
      }}
      open
      size='tiny'
    >
      <Modal.Header color='lightBlue1'>Sign transaction</Modal.Header>
      <Modal.Content>
        <Stacked alignItems='flex-start'>
          <p>
            By signing this transaction you are confirming that you wish to:
          </p>
          <TxSummary
            amount={pendingTx.details.amount}
            methodCall={pendingTx.extrinsic.method.meta.name.toString()}
            recipientAddress={pendingTx.details.recipientAddress}
            senderAddress={senderPair.address}
          />
          {senderPair.isLocked && (
            <>
              <Margin top />
              <Input
                fluid
                label='Password'
                onChange={handlePasswordChange}
                type='password'
                value={inputPassword}
              />
              <Margin top />
            </>
          )}
          {error && <ErrorText>{error}</ErrorText>}
          <TxDetails
            allFees={pendingTx.details.allFees}
            allTotal={pendingTx.details.allTotal}
            amount={pendingTx.details.amount}
            recipientAddress={pendingTx.details.recipientAddress}
            senderAddress={senderPair.address}
          />
        </Stacked>
      </Modal.Content>
      <Modal.Actions>
        <StackedHorizontal justifyContent='flex-end'>
          <StyledLinkButton onClick={clear} type='button'>
            Cancel
          </StyledLinkButton>
          <Margin left='small' />
          <NavButton disabled={senderPair.isLocked && !inputPassword}>
            OK
          </NavButton>
        </StackedHorizontal>
      </Modal.Actions>
    </Modal>
  );
}
