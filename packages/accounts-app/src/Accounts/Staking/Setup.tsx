// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import PolkadotInputAddress from '@polkadot/ui-app/InputAddress';
import { Balance, Icon, ErrorText, FlexItem, Stacked, StyledNavButton, SubHeader, WithSpace } from '@substrate/ui-components';
import { Either, left, right } from 'fp-ts/lib/Either';
import React, { Dispatch, useState } from 'react';
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
  value: Either<Errors, Accounts>;
}

function Validation (props: ValidationProps) {
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

export function Setup (props: Props) {
  const { history } = props;
  const [controller, setController] = useState();
  const [stash, setStash] = useState();

  const status: Either<Errors, Accounts> = validate().fold(
    (errors: Errors) => left(errors),
    (accounts: Accounts) => right(accounts)
  );

  const handleNext = () => {
    status.fold(
      () => { /* */ },
      ({ controller, stash }: Accounts) => history.push(`/manageAccounts/${stash}/staking/bond`, {
        controller,
        stash
      })
    );
  };

  function validate (): Either<Errors, Accounts> {
    const errors = [] as Errors;
    // controlelr should be diff from stash
    if (controller === stash) {
      errors.push('Controller account must be different from Stash account!');
    }

    // TODO first do the PR that'll move account related queries to user context. avoids duplicating balance calls everywhere.
    // https://github.com/paritytech/substrate-light-ui/pull/415
    //
    // both should have a decent amount of balance.
    //
    // stash account should have significantly more balance than controller

    return errors.length ? left(errors) : right({ stash, controller } as Accounts);
  }

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
          <Validation value={status} />
        </FlexItem>
        <FlexItem>
          <StyledNavButton onClick={handleNext}>Next</StyledNavButton>
        </FlexItem>
      </Stacked>
    </React.Fragment>
  );
}
