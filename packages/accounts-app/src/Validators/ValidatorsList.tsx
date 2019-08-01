// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AccountId } from '@polkadot/types';
import { FadedText, FlexItem, Stacked, Table } from '@substrate/ui-components';
import { AlertsContext, AppContext } from '@substrate/ui-common';
import BN from 'bn.js';
import { fromNullable } from 'fp-ts/lib/Option';
import React, { useContext, useEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { combineLatest, Observable, Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import Loader from 'semantic-ui-react/dist/commonjs/elements/Loader/Loader';

import { ValidatorListHeader } from './ValidatorListHeader';
import { ValidatorRow } from './ValidatorRow';

interface MatchParams {
  currentAccount: string;
}

interface Props extends RouteComponentProps<MatchParams> {}

export function ValidatorsList (props: Props) {
  const { enqueue: alert } = useContext(AlertsContext);
  const { api } = useContext(AppContext);
  const [currentValidatorsControllersV1OrStashesV2, setCurrentValidatorsControllersV1OrStashesV2] = useState<AccountId[]>([]);
  const [nominees, setNominees] = useState<Set<string>>(new Set());
  const [validatorCount, setValidatorCount] = useState<BN>(new BN(0));

  useEffect(() => {
    const subscription: Subscription = combineLatest([
      (api.query.session.validators() as unknown as Observable<AccountId[]>),
      (api.query.staking.validatorCount() as unknown as Observable<BN>)
    ])
    .pipe(take(1))
    .subscribe(([validators, validatorCount]) => {
      setCurrentValidatorsControllersV1OrStashesV2(validators);
      setValidatorCount(validatorCount);
    });

    return () => subscription.unsubscribe();
  }, []);

  const addToNomineeList = ({ currentTarget: { dataset: { nominee } } }: React.MouseEvent<HTMLElement>) => {
    if (!nominee) { return; } // nominee should always be defined..

    if (nominees.has(nominee)) {
      alert({ type: 'warning', content: 'You have already added this Validator to your nominee list' });
    }

    let newNominees = nominees.add(nominee.toString());
    setNominees(newNominees);
  };

  const renderBody = () => (
    <Table.Body>
      {
        fromNullable(currentValidatorsControllersV1OrStashesV2)
          .map(validators => validators.map(renderValidatorRow))
          .getOrElse([1].map(() => <Table.Row textAlign='center'><Loader active inline /></Table.Row>))
      }
    </Table.Body>
  );

  const renderValidatorRow = (validator: AccountId) => (
    <ValidatorRow
      addToNomineeList={addToNomineeList}
      key={validator.toString()}
      validator={validator} />
  );

  const renderHeader = () => {
    return (
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>Am I Nominating?</Table.HeaderCell>
          <Table.HeaderCell>
            Validators {`${currentValidatorsControllersV1OrStashesV2.length} / ${validatorCount.toString()}`}
          </Table.HeaderCell>
          <Table.HeaderCell>Nominators</Table.HeaderCell>
          <Table.HeaderCell>Actions</Table.HeaderCell>
        </Table.Row>
      </Table.Header>
    );
  };

  const renderContent = () => {
    return (
      <React.Fragment>
        {renderHeader()}
        {renderBody()}
      </React.Fragment>
    );
  };

  return (
    <Stacked>
      <ValidatorListHeader history={props.history} nominees={nominees} />
      {
        currentValidatorsControllersV1OrStashesV2.length
          ? (
            <Table basic celled sortable stackable textAlign='center' width='16'>
              {renderContent()}
            </Table>
          )
        : <FlexItem><FadedText>Loading current validator set... <Loader inline active /></FadedText></FlexItem>
      }
    </Stacked>
  );
}
