// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AppContext } from '@substrate/ui-common';
import { FadedText, Header, Stacked, Table } from '@substrate/ui-components';
import { Vec } from '@polkadot/types';
import { ITuple } from '@polkadot/types/types';
import { AccountId, PropIndex, Proposal } from '@polkadot/types/interfaces';
import React, { useContext, useEffect, useState } from 'react';
import { take } from 'rxjs/operators';

import { ProposalRow } from './ProposalRow';

export function Proposals (): React.ReactElement {
  const { api } = useContext(AppContext);
  const [publicProposals, setProposals] = useState();

  useEffect(() => {
    // FIXME Tuple doesn't take generic types
    // More accurate type is Vector<(PropIndex, Proposal, AccountId)>
    const subscription = api.query.democracy.publicProps<Vec<ITuple<[PropIndex, Proposal, AccountId]>>>()
      .pipe(
        take(1)
      )
      .subscribe((proposals) => {
        setProposals(proposals);
      });
    return (): void => subscription.unsubscribe();
  });

  const renderProposalRow = ([propIndex, proposal, proposer]: ITuple<[PropIndex, Proposal, AccountId]>): React.ReactElement => {
    return (
      <ProposalRow
        key={propIndex.toString()}
        propIndex={propIndex}
        proposal={proposal}
        proposer={proposer}
      />
    );
  };

  const renderEmptyTable = (): React.ReactElement => {
    return (
      <Table.Row>
        <Table.Cell>
          <FadedText>No Active Public Proposals...</FadedText>
        </Table.Cell>
      </Table.Row>
    );
  };

  const renderProposalsTable = (): React.ReactElement => {
    return (
      publicProposals.map((proposal: ITuple<[PropIndex, Proposal, AccountId]>) => {
        return renderProposalRow(proposal);
      })
    );
  };

  const renderProposalsTableHeaderRow = (): React.ReactElement => {
    return (
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>Proposal #</Table.HeaderCell>
          <Table.HeaderCell>Extrinsic</Table.HeaderCell>
          <Table.HeaderCell>Meta Description</Table.HeaderCell>
          <Table.HeaderCell>Proposed By</Table.HeaderCell>
          <Table.HeaderCell>Seconded By</Table.HeaderCell>
          <Table.HeaderCell>Proposal Balance</Table.HeaderCell>
          <Table.HeaderCell>Actions</Table.HeaderCell>
        </Table.Row>
      </Table.Header>
    );
  };

  return (
    <Stacked alignItems='flex-start'>
      <Header margin='small'> Public Proposals </Header>
      <Table striped>
        {renderProposalsTableHeaderRow()}
        <Table.Body>
          {
            publicProposals && publicProposals[0]
              ? renderProposalsTable()
              : renderEmptyTable()
          }
        </Table.Body>
      </Table>
    </Stacked>
  );
}
