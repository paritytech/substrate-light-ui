// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import { AppContext } from '@substrate/ui-common';
import { Table } from '@substrate/ui-components';
import { AccountId, PropIndex, Proposal, Tuple, Vec } from '@polkadot/types';
// import BN from 'bn.js';
import React, { useContext, useEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';

import { ProposalRow } from './ProposalRow';
interface IProps extends RouteComponentProps {}

export function Proposals (props: IProps) {
  const { api } = useContext(AppContext);
  const [proposals, setProposals] = useState();

  useEffect(() => {
    const subscription = (api.query.democracy.publicProps() as unknown as Observable<Vec<(PropIndex, Proposal, AccountId)>>)
      .pipe(
        take(1)
      )
      .subscribe((proposals) => {
        setProposals([proposals]);
      });
    return () => subscription.unsubscribe();
  });

  const renderProposalRow = (propo: Tuple) => {
    console.log(propo[0]); // PropIndex
    console.log(propo[1]); // Proposal
    console.log(propo[2]); // AccountId

    const propIndex = propo[0];
    const _proposal = propo[1];

    return (
      <ProposalRow
        key={propIndex.toString()}
        proposal={_proposal}
      />
    );
  };

  return (
    <Table>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>Block #</Table.HeaderCell>
          <Table.HeaderCell>Proposal</Table.HeaderCell>
          <Table.HeaderCell>Proposed By</Table.HeaderCell>
          <Table.HeaderCell>Seconded By</Table.HeaderCell>
          <Table.HeaderCell>Remaining Time</Table.HeaderCell>
          <Table.HeaderCell>Meta Description</Table.HeaderCell>
          <Table.HeaderCell>Votes</Table.HeaderCell>
        </Table.Row>
      </Table.Header>

      <Table.Body>
        {
          proposals && proposals.map((p: Vec<(PropIndex, Proposal, AccountId)>) => {
            console.log('p -> ', p);
            if (p[0] !== undefined) {
              console.log('p is defined -> ', p[0]);
              return renderProposalRow(p[0]);
            }
          })
        }
      </Table.Body>
    </Table>
  );
}
