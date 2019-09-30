// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ReferendumInfoExtended } from '@polkadot/api-derive/type';
import { Option } from '@polkadot/types';
import { AppContext } from '@substrate/ui-common';
import { FadedText, Header, Stacked, Table } from '@substrate/ui-components';
import React, { useContext, useEffect, useState } from 'react';

import { ReferendumRow } from './ReferendumRow';

export function Referenda () {
  const { api } = useContext(AppContext);
  const [referenda, setReferenda] = useState();

  useEffect(() => {
    const subscription = api.derive.democracy.referendums<Option<ReferendumInfoExtended>[]>()
      .subscribe((referenda) => {
        setReferenda(referenda);
      });
    return () => subscription.unsubscribe();
  }, []);

  const renderEmptyTable = () => {
    return (
      <Table.Row>
        <Table.Cell>
          <FadedText>No Active Referenda...</FadedText>
        </Table.Cell>
      </Table.Row>
    );
  };

  const renderReferendaTable = () => {
    return (
      referenda.map((_referendum: Option<ReferendumInfoExtended>) => {
        const referendum = _referendum.unwrapOr(null);

        return (
          referendum
          && <ReferendumRow idNumber={referendum.index} key={referendum.index.toString()} referendum={referendum} />
        );
      })
    );
  };

  const renderReferendaTableHeaderRow = () => {
    return (
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>ID #</Table.HeaderCell>
          <Table.HeaderCell>Proposal</Table.HeaderCell>
          <Table.HeaderCell>Enactment Delay</Table.HeaderCell>
          <Table.HeaderCell>Total Votes</Table.HeaderCell>
          <Table.HeaderCell>Time Remaining</Table.HeaderCell>
          <Table.HeaderCell>Status</Table.HeaderCell>
          <Table.HeaderCell>Actions</Table.HeaderCell>
        </Table.Row>
      </Table.Header>
    );
  };

  return (
    <Stacked alignItems='flex-start'>
      <Header margin='small'>Public Referenda </Header>
      <Table>
        {renderReferendaTableHeaderRow()}
        <Table.Body>
          {
            referenda && referenda.length
              ? renderReferendaTable()
              : renderEmptyTable()
          }
        </Table.Body>
      </Table>
    </Stacked>
  );
}
