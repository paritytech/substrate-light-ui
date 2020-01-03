// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { KeyringAddress } from '@polkadot/ui-keyring/types';
import { isFunction } from '@polkadot/util';
import { KeyringContext } from '@substrate/accounts-app';
import { getKeyringAddress, handler } from '@substrate/context';
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
function getAddressName(keyringAddress: Either<Error, KeyringAddress>): string {
  return keyringAddress.map(keyringAddress => keyringAddress.meta.name || '').getOrElse('');
}

function renderError(error?: string): React.ReactElement {
  return <ErrorText>{error}</ErrorText>;
}

function renderSuccess(success?: string): React.ReactElement {
  return <SuccessText>{success}</SuccessText>;
}

export function SaveAddress(props: Props): React.ReactElement {
  const { addressDisabled, defaultAddress = '', onSave } = props;

  const { keyring } = useContext(KeyringContext);

  const [address, setAddress] = useState(defaultAddress);
  const keyringAddress = getKeyringAddress(keyring, address);
  const [name, setName] = useState(getAddressName(keyringAddress));

  useEffect(() => {
    setAddress(defaultAddress);
    setName(getAddressName(keyringAddress));
    // eslint-disable-next-line
  }, [defaultAddress, keyringAddress]); // No need for keyringAddress dep, because it already depends on defaultAddress

  const [error, setError] = useState<string | undefined>(undefined);
  const [success, setSuccess] = useState<string | undefined>(undefined);

  const onError = (value?: string): void => {
    setError(value);
    setSuccess(undefined);
  };

  const onSuccess = (value?: string): void => {
    setError(undefined);
    setSuccess(value);
  };

  const handleSubmit = (): void => {
    try {
      // if address already saved under this name: throw
      const lookupAddress = keyring.getAddress(address);
      if (lookupAddress && lookupAddress.meta.name === name) {
        throw new Error('This address has already been saved under this name.');
      }

      // If the address is already saved, just update the name
      keyring.saveAddress(address, { name });

      onSuccess('Successfully saved address');

      if (onSave && isFunction(onSave)) {
        onSave();
      }
    } catch (e) {
      onError(e.message);
    }
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
          <Input fluid label='Name' onChange={handler(setName)} required type='text' value={name} />
          <Margin top />
          <NavButton type='submit' value='Save Address' />
          {renderError(error)}
          {renderSuccess(success)}
        </WrapperDiv>
      </Stacked>
    </Form>
  );
}
