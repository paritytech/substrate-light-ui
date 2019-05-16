// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import { ReferendumInfoExtended } from '@polkadot/api-derive/democracy/referendumInfo';
import { Option } from '@polkadot/types';
import { AppContext } from '@substrate/ui-common';
import { FadedText, Header, Stacked, Table } from '@substrate/ui-components';
import React, { useContext, useEffect, useState } from 'react';
import { Observable } from 'rxjs';

import { ReferendumRow } from './ReferendumRow';
interface IProps { }

export function Referenda (props: IProps) {
  const { api } = useContext(AppContext);
  const [referenda, setReferenda] = useState();

  useEffect(() => {
    const subscription = (api.derive.democracy.referendums() as unknown as Observable<Array<Option<ReferendumInfoExtended>>>)
      .subscribe((referenda) => {
        setReferenda(referenda);
      });
    return () => subscription.unsubscribe();
  });

  const renderReferendumRow = (_referendum: any) => {
    return (
      <ReferendumRow
        idNumber={_referendum.index}
        key={_referendum.index.toString()}
        referendum={_referendum}
        />
    );
  };

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

        renderReferendumRow(referendum);
      })
    );
  };

  const renderReferendaTableHeaderRow = () => {
    return (
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>Block #</Table.HeaderCell>
          <Table.HeaderCell>Proposal</Table.HeaderCell>
          <Table.HeaderCell>Proposed By</Table.HeaderCell>
          <Table.HeaderCell>Seconded By</Table.HeaderCell>
          <Table.HeaderCell>Remaining Blocks</Table.HeaderCell>
          <Table.HeaderCell>Meta Description</Table.HeaderCell>
          <Table.HeaderCell>Proposal Balance</Table.HeaderCell>
          <Table.HeaderCell>Votes</Table.HeaderCell>
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
