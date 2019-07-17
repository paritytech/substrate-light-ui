// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DerivedStaking } from '@polkadot/api-derive/types';
import { AccountId } from '@polkadot/types';
import { AppContext } from '@substrate/ui-common';
import { AddressSummary, Table } from '@substrate/ui-components';
import React, { useContext, useEffect, useState } from 'react';

import { RecentlyOfflineMap } from '../types';

interface Props {
  name?: string;
  recentlyOffline?: RecentlyOfflineMap;
  validator: AccountId;
}

export function ValidatorRow (props: Props) {
  const { name, recentlyOffline, validator } = props;
  const { api } = useContext(AppContext);
  const [derivedStaking, setDerivedStaking] = useState<DerivedStaking>();

  useEffect(() => {
    console.log(derivedStaking);
    debugger;
    api.derive.staking(validator)
      .subscribe((derivedStaking: DerivedStaking) => {
        setDerivedStaking(derivedStaking);
      });
  });
  debugger;

  return (
    <Table.Row>
      <Table.Cell><AddressSummary address={validator.toString()} orientation='horizontal' name={name} size='medium' /></Table.Cell>
      <Table.Cell>{recentlyOffline && recentlyOffline[validator.toString()][0]}</Table.Cell>
      <Table.Cell>nominators</Table.Cell>
    </Table.Row>
  );
}