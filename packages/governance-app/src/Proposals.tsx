// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import { AppContext } from '@substrate/ui-common';
import { FadedText, Table } from '@substrate/ui-components';
import { PropIndex, Proposal, Tuple, Vector } from '@polkadot/types';
// import BN from 'bn.js';
import React, { useContext, useEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';

import { ProposalRow } from './ProposalRow';
interface IProps extends RouteComponentProps {}

export function Proposals (props: IProps) {
  const { api } = useContext(AppContext);
  const [publicProposals, setProposals] = useState();

  useEffect(() => {
    // FIXME Tuple doesn't take generic types
    // More accurate type is Vector<(PropIndex, Proposal, AccountId)>
    const subscription = (api.query.democracy.publicProps() as unknown as Observable<Vector<Tuple>>)
      .pipe(
        take(1)
      )
      .subscribe((proposals) => {
        setProposals(proposals);
      });
    return () => subscription.unsubscribe();
  });

  // FIXME Tuple doesn't take generic types
  // More accurate type is Vector<(PropIndex, Proposal, AccountId)>
  const renderProposalRow = (_proposal: any) => {
    console.log(_proposal[0]); // PropIndex
    console.log(_proposal[1]); // Proposal
    console.log(_proposal[2]); // AccountId

    const propIndex: PropIndex = _proposal[0];
    const proposal: Proposal = _proposal[1];
    const proposer = _proposal[2];

    return (
      <ProposalRow
        key={propIndex.toString()}
        propIndex={propIndex}
        proposal={proposal}
        proposer={proposer}
      />
    );
  };

  const renderEmptyTable = () => {
    return (
      <Table.Row>
        <Table.Cell>
          <FadedText>No Active Public Proposals...</FadedText>
        </Table.Cell>
      </Table.Row>
    );
  };

  const renderProposalsTable = () => {
    // FIXME Tuple doesn't take generic types
    // More accurate type is Vector<(PropIndex, Proposal, AccountId)>
    return (
      publicProposals.map((proposal: Vector<any>) => {
        // @ts-ignore
        return proposal[0] && renderProposalRow(proposal[0]);
      })
    );
  };

  const renderProposalsTableHeaderRow = () => {
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
    <Table>
      { renderProposalsTableHeaderRow() }
      <Table.Body>
      {
        publicProposals && publicProposals[0]
          ? renderProposalsTable()
          : renderEmptyTable()
      }
      </Table.Body>
    </Table>
  );
}
