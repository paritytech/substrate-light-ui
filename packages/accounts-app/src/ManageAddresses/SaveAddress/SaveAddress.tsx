// Copyright 2018-2020 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { isFunction } from '@polkadot/util';
import { KeyringContext } from '@substrate/context';
import { ErrorText, Form, Input, Margin, NavButton, Stacked, SuccessText, WrapperDiv } from '@substrate/ui-components';
import React, { useContext, useState } from 'react';

interface Props {
  addressDisabled?: boolean;
  onSave?: () => void;
}

function renderError(error?: string): React.ReactElement {
  return <ErrorText>{error}</ErrorText>;
}

function renderSuccess(success?: string): React.ReactElement {
  return <SuccessText>{success}</SuccessText>;
}

export function SaveAddress(props: Props): React.ReactElement {
  const { addressDisabled, onSave } = props;

  const { keyring } = useContext(KeyringContext);

  const [address, setAddress] = useState();
  const [name, setName] = useState();

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

  const handleChangeAddress = ({ target: { value } }: React.ChangeEvent<HTMLInputElement>): void => {
    setAddress(value);
  };

  const handleSetName = ({ target: { value } }: React.ChangeEvent<HTMLInputElement>): void => {
    setName(value);
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
            onChange={handleChangeAddress}
            required
            placeholder='e.g. 5ErZS1o.....'
            type='text'
            value={address}
          />
          <Margin top />
          <Input fluid label='Name' onChange={handleSetName} required type='text' value={name} />
          <Margin top />
          <NavButton type='submit' value='Save Address' />
          {renderError(error)}
          {renderSuccess(success)}
        </WrapperDiv>
      </Stacked>
    </Form>
  );
}
