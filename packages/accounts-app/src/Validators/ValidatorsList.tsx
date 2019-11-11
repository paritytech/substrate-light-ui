// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { createType, u32 } from '@polkadot/types';
import { AccountId } from '@polkadot/types/interfaces';
import { FadedText, FlexItem, Stacked, Table, WrapperDiv } from '@substrate/ui-components';
import { AlertsContext, AppContext } from '@substrate/ui-common';
import { fromNullable } from 'fp-ts/lib/Option';
import React, { useContext, useEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { combineLatest, Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import Loader from 'semantic-ui-react/dist/commonjs/elements/Loader/Loader';

import { ValidatorListHeader } from './ValidatorListHeader';
import { ValidatorRow } from './ValidatorRow';

interface MatchParams {
  currentAccount: string;
}

type Props = RouteComponentProps<MatchParams>

export function ValidatorsList (props: Props): React.ReactElement {
  const { enqueue: alert } = useContext(AlertsContext);
  const { api } = useContext(AppContext);
  const [currentValidatorsControllersV1OrStashesV2, setCurrentValidatorsControllersV1OrStashesV2] = useState<AccountId[]>([]);
  const [nominees, setNominees] = useState<Set<string>>(new Set());
  const [validatorCount, setValidatorCount] = useState(createType('u32', 0));

  useEffect(() => {
    const subscription: Subscription = combineLatest([
      api.query.session.validators<AccountId[]>(),
      api.query.staking.validatorCount<u32>()
    ])
      .pipe(take(1))
      .subscribe(([validators, validatorCount]) => {
        setCurrentValidatorsControllersV1OrStashesV2(validators);
        setValidatorCount(validatorCount);
      });

    return (): void => subscription.unsubscribe();
  }, [api.query.session, api.query.staking]);

  const addToNomineeList = ({ currentTarget: { dataset: { nominee } } }: React.MouseEvent<HTMLElement>): void => {
    if (nominees.has(nominee!)) {
      alert({ type: 'warning', content: 'You have already added this Validator to your nominee list' });
    }

    const newNominees = nominees.add(nominee!);
    setNominees(newNominees);
  };

  const renderValidatorRow = (validator: AccountId): React.ReactElement => (
    <ValidatorRow
      addToNomineeList={addToNomineeList}
      key={validator.toString()}
      validator={validator} />
  );

  const renderBody = (): React.ReactElement => (
    <Table.Body>
      {
        fromNullable(currentValidatorsControllersV1OrStashesV2)
          .map(validators => validators.map(renderValidatorRow))
          .getOrElse([1].map((i) => <Table.Row key={i} textAlign='center'><Loader active inline /></Table.Row>))
      }
    </Table.Body>
  );

  const renderHeader = (): React.ReactElement => {
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

  const renderContent = (): React.ReactElement => {
    return (
      <React.Fragment>
        {renderHeader()}
        {renderBody()}
      </React.Fragment>
    );
  };

  return (
    <Stacked>
      <WrapperDiv><ValidatorListHeader history={props.history} nominees={nominees} /></WrapperDiv>
      {
        currentValidatorsControllersV1OrStashesV2.length
          ? (
            <Table basic celled sortable stackable textAlign='center' width='16'>
              {renderContent()}
            </Table>
          )
          : <FlexItem><FadedText>Loading current validator set... </FadedText><Loader inline active /></FlexItem>
      }
    </Stacked>
  );
}
