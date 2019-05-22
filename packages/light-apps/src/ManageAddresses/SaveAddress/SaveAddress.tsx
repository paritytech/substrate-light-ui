// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Keyring } from '@polkadot/ui-keyring';
import { KeyringAddress } from '@polkadot/ui-keyring/types';
import { isFunction } from '@polkadot/util';
import { AppContext } from '@substrate/ui-common';
import { ErrorText, Form, Input, Margin, NavButton, Stacked, SuccessText, WrapperDiv } from '@substrate/ui-components';
import { Either, fromOption, tryCatch2v } from 'fp-ts/lib/Either';
import { fromNullable } from 'fp-ts/lib/Option';
import React, { useContext, useEffect, useState } from 'react';

interface Props {
  addressDisabled?: boolean;
  defaultAddress?: string;
  onSave?: () => void;
}

/**
 * From an `address` string, check if it's in the keyring, and returns an Either
 * of KeyringAddress.
 */
function getKeyringAddress (keyring: Keyring, address?: string): Either<Error, KeyringAddress> {
  return fromOption(new Error('You need to specify an address'))(fromNullable(address))
    // `keyring.getAddress` might fail: catch and return None if it does
    .chain((addr) => tryCatch2v(() => keyring.getAddress(addr), (e) => e as Error))
    .chain((keyringAddress) => tryCatch2v(
      () => {
        // If `.getMeta` doesn't throw, then it mean the address exists
        // https://github.com/polkadot-js/ui/issues/133
        keyringAddress.getMeta();
        return keyringAddress;
      },
      (e) => e as Error)
    );
}

export function SaveAddress (props: Props) {
  const { addressDisabled, defaultAddress, onSave } = props;

  const { keyring } = useContext(AppContext);

  const [address, setAddress] = useState(defaultAddress || '');
  const keyringAddress = getKeyringAddress(keyring, address);
  const [name, setName] = useState(
    keyringAddress.map((keyringAddress) => keyringAddress.getMeta().name).getOrElse('')
  );

  useEffect(() => {
    setAddress(defaultAddress || '');
    setName(keyringAddress.map((keyringAddress) => keyringAddress.getMeta().name).getOrElse(''));
  }, [defaultAddress, keyringAddress]);

  const [error, setError] = useState<string | undefined>(undefined);
  const [success, setSuccess] = useState<string | undefined>(undefined);

  const handleInputAddress = ({ target: { value } }: React.ChangeEvent<HTMLInputElement>) => {
    setAddress(value);
  };

  const handleInputName = ({ target: { value } }: React.ChangeEvent<HTMLInputElement>) => {
    setName(value);
  };

  const handleSubmit = () => {
    try {
      // if address already saved under this name: throw
      const lookupAddress = keyring.getAddress(address);
      if (lookupAddress && lookupAddress.getMeta().name === name) {
        throw new Error('This address has already been saved under this name.');
      }

      // If the address is already saved, just update the name
      keyring.saveAddress(address, { name });

      onSuccess('Successfully saved address');

      if (isFunction(onSave)) {
        onSave();
      }
    } catch (e) {
      onError(e.message);
    }
  };

  const onError = (value?: string) => {
    setError(value);
    setSuccess(undefined);
  };

  const onSuccess = (value?: string) => {
    setError(undefined);
    setSuccess(value);
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Stacked>
        <WrapperDiv>
          <Input
            disabled={addressDisabled}
            fluid
            label='Address'
            onChange={handleInputAddress}
            required
            placeholder='e.g. 5ErZS1o.....'
            type='text'
            value={address}
          />
          <Margin top />
          <Input
            fluid
            label='Name'
            onChange={handleInputName}
            required
            type='text'
            value={name}
          />
          <Margin top />
          <NavButton type='submit' value='Save Address' />
          {renderError(error)}
          {renderSuccess(success)}
        </WrapperDiv>
      </Stacked>
    </Form>
  );
}

function renderError (error?: string) {
  return (
    <ErrorText>
      {error}
    </ErrorText>
  );
}

function renderSuccess (success?: string) {
  return (
    <SuccessText>
      {success}
    </SuccessText>
  );
}
