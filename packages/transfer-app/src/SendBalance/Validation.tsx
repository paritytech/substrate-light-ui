// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { validateWarnings } from '@substrate/context';
import { ErrorText, List, Stacked, SubHeader } from '@substrate/ui-components';
import { Either } from 'fp-ts/lib/Either';
import { fromEither } from 'fp-ts/lib/Option';
import React from 'react';

import { AllExtrinsicData, Errors, Warnings } from './types';

interface Props {
  values: Either<Errors, AllExtrinsicData>;
}

function renderErrors (errors: Errors): React.ReactElement {
  // For now we assume there's only one error, and show it. It should be
  // relatively easy to extend to show multiple errors.
  const error = Object.values(errors)[0];

  return (
    <React.Fragment>
      <SubHeader textAlign='left'>Errors</SubHeader>
      <ErrorText>
        {error}
      </ErrorText>
    </React.Fragment>
  );
}

function renderNull (): null {
  return null;
}

function renderWarnings (warnings: Warnings): React.ReactElement {
  return (
    <React.Fragment>
      <SubHeader textAlign='left'>Warnings</SubHeader>
      <List>
        {warnings.map((warning) => <List.Item key={warning}>{warning}</List.Item>)}
      </List>
    </React.Fragment>
  );
}

export function Validation (props: Props): React.ReactElement {
  const { values } = props;
  const warnings = fromEither(values).chain(validateWarnings);

  return (
    <Stacked alignItems='flex-start'>
      {values.fold(renderErrors, renderNull)}
      {warnings.fold(null, renderWarnings)}
    </Stacked>
  );
}
