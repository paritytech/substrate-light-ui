// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { KeyringAddress } from '@polkadot/ui-keyring/types';
import { isFunction } from '@polkadot/util';
import { AppContext, getKeyringAddress, handler } from '@substrate/ui-common';
import { ErrorText, Form, Input, Margin, NavButton, Stacked, SuccessText, WrapperDiv } from '@substrate/ui-components';
import { Either } from 'fp-ts/lib/Either';
import React, { useContext, useEffect, useState } from 'react';

interface Props {
  addressDisabled?: boolean;
  defaultAddress?: string;
  onSave?: () => void;
}

/**
 * Get the address's name. Return `''` if the address doesn't exist.
 */
function getAddressName (keyringAddress: Either<Error, KeyringAddress>) {
  return keyringAddress.map((keyringAddress) => keyringAddress.meta.name || '').getOrElse('');
}

export function SaveAddress (props: Props) {
  const { addressDisabled, defaultAddress = '', onSave } = props;

  const { keyring } = useContext(AppContext);

  const [address, setAddress] = useState(defaultAddress);
  const keyringAddress = getKeyringAddress(keyring, address);
  const [name, setName] = useState(getAddressName(keyringAddress));

  useEffect(() => {
    setAddress(defaultAddress);
    setName(getAddressName(keyringAddress));
    // eslint-disable-next-line
  }, [defaultAddress]); // No need for keyringAddress dep, because it already depends on defaultAddress

  const [error, setError] = useState<string | undefined>(undefined);
  const [success, setSuccess] = useState<string | undefined>(undefined);

  const handleSubmit = () => {
    try {
      // if address already saved under this name: throw
      const lookupAddress = keyring.getAddress(address);
      if (lookupAddress && lookupAddress.meta.name === name) {
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
            onChange={handler(setAddress)}
            required
            placeholder='e.g. 5ErZS1o.....'
            type='text'
            value={address}
          />
          <Margin top />
          <Input
            fluid
            label='Name'
            onChange={handler(setName)}
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
