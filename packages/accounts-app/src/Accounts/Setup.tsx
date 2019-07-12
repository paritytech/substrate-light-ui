// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import PolkadotInputAddress from '@polkadot/ui-app/InputAddress';
import { Balance, Stacked, SubHeader, FlexItem, StyledNavButton, ErrorText } from '@substrate/ui-components';
import { none, Option, some } from 'fp-ts/lib/Option';
import { Either, left, right } from 'fp-ts/lib/Either';
import React, { useState, Dispatch } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import styled from 'styled-components';

export const InputAddress = styled(PolkadotInputAddress)`
  .dropdown {
    min-width: 0;
    width: '25%';
  }
`;

interface MatchParams {
  currentAccount?: string;
}

interface Props extends RouteComponentProps<MatchParams> {
  setController: Dispatch<any>;
  controller: string;
  setStash: Dispatch<any>;
  stash: string;
}

type Accounts = {
  stash: string,
  controller: string
};

type Error = string;
type Errors = Array<Error>;

interface ValidationProps {
  errors: Option<Errors>;
}

function Validation (props: ValidationProps) {
  const { errors } = props;

  const renderErrors = (errors: Errors) => {
    return Object.values(errors).map(error => {
      return (
        <React.Fragment>
          <ErrorText>
            {error}
          </ErrorText>
        </React.Fragment>
      );
    });
  };

  return (
    <Stacked>
      <SubHeader textAlign='left'>Errors</SubHeader>
      {
        errors.fold(
          renderErrors,
          () => null
        )
      }
    </Stacked>
  );
}

export function Setup (props: Props) {
  const [errors, setErrors] = useState<Option<Errors>>(none);
  const { controller, setController, setStash, stash } = props;

  const handleNext = () => {
    const { history } = props;

    validate().fold(
      (errors: string[]) => setErrors(some(errors)),
      ({ stash }: Accounts) => {
        history.push(`/manageAccounts/${stash}/staking/bond`);
      }
    );
  };

  const validate = (): Either<Errors, Accounts> => {
    const errors = [] as Errors;
    // controlelr should be diff from stash
    if (controller === stash) {
      errors.push('Controller account must be different from Stash account!');
    }

    // both should have a decent amount of balance.

    // stash account should have significantly more balance than controller

    return errors.length ? left(errors) : right({
      stash,
      controller
    });
  };

  return (
    <React.Fragment>
      <Stacked>
        <FlexItem>
          <SubHeader> Select your Stash Account </SubHeader>
          <InputAddress
            label={null}
            onChange={setStash}
            type='account'
            value={stash}
            withLabel={false}
          />
          <Balance address={stash} />
        </FlexItem>
        <FlexItem>
          <SubHeader> Select your Controller Account </SubHeader>
          <InputAddress
            label={null}
            onChange={setController}
            type='account'
            value={controller}
            withLabel={false}
          />
          <Balance address={controller} />
        </FlexItem>
        <FlexItem>
          <Validation errors={errors} />
        </FlexItem>
        <FlexItem>
          <StyledNavButton onClick={handleNext}>Next</StyledNavButton>
        </FlexItem>
      </Stacked>
    </React.Fragment>
  );
}
