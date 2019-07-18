// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AccountId, Vector } from '@polkadot/types';
import { AppContext } from '@substrate/ui-common';
import { AddressSummary, Table } from '@substrate/ui-components';
import BN from 'bn.js';
import { fromNullable } from 'fp-ts/lib/Option';
import React, { useContext, useEffect, useState } from 'react';
import { Subscription, Observable, combineLatest } from 'rxjs';
import { take } from 'rxjs/operators';
import { Loader } from 'semantic-ui-react';

import { OfflineStatus } from '../types';

interface Props {
  name?: string;
  offlineStatuses?: OfflineStatus[];
  validator: AccountId;
}

export function ValidatorRow (props: Props) {
  const { name, offlineStatuses, validator } = props;
  const { api } = useContext(AppContext);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [nominatorsForValidator, setNominatorsForValidator] = useState<Array<AccountId>>();
  const [offlineTotal, setOfflineTotal] = useState<BN>(new BN(0));

  useEffect(() => {
    const subscription: Subscription = combineLatest([
      (api.query.staking.nominators(validator) as Observable<Vector<AccountId>>)
    ]).pipe(
      take(1)
    ).subscribe(([nominators]) => {
      setNominatorsForValidator(nominators);
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    fromNullable(offlineStatuses)
      .map(offlineStatuses => setOfflineTotal(offlineStatuses.reduce((total, { count }) => total.add(count), new BN(0))))
      .getOrElse(undefined);
  }, [offlineStatuses]);

  return (
    <Table.Row>
      {
        isLoading
          ? <Table.Cell><Loader active inline /></Table.Cell>
          : (
            <React.Fragment>
              <Table.Cell><AddressSummary address={validator.toString()} orientation='horizontal' name={name} size='medium' /></Table.Cell>
              <Table.Cell>{offlineTotal.toString()}</Table.Cell>
              <Table.Cell>
                 {
                    fromNullable(nominatorsForValidator)
                      .mapNullable(nominators => nominators.map(nom => console.log('nom =>>> ', nom)))
                      .getOrElse([].map(() => console.log('nohting')))
                 }
              </Table.Cell>
            </React.Fragment>
          )
      }
    </Table.Row>
  );
}