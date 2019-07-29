// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ErrorText, Icon, Stacked, WithSpace } from '@substrate/ui-components';
import { Either } from 'fp-ts/lib/Either';
import React from 'react';

import { Accounts, Errors } from '../types';

interface ValidationProps {
  value: Either<Errors, Accounts>;
}

export function Validation (props: ValidationProps) {
  const { value } = props;

  function renderErrors (errors: Errors) {
    return (
      <WithSpace>
        {
          errors.map(error => (
            <ErrorText key={error}>
              {error}
            </ErrorText>
          ))
        }
      </WithSpace>
    );
  }

  function renderSuccess (accounts: Accounts) {
    return (
      <WithSpace>
        <Icon name='checkmark' />
      </WithSpace>
    );
  }

  return (
    <Stacked>
      {value.fold(renderErrors, renderSuccess)}
    </Stacked>
  );
}
