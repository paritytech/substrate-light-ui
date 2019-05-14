// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import { AppContext } from '@substrate/ui-common';
import { Table } from '@substrate/ui-components';
import { Proposal } from '@polkadot/types';
import BN from 'bn.js';
import React, { useContext, useEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { Observable } from 'rxjs';

import { ProposalRow } from './ProposalRow';

interface IProps extends RouteComponentProps {}

export function Proposals (props: IProps) {
  const { api } = useContext(AppContext);
  const [publicProposals, setProposals] = useState();

  useEffect(() => {
    const subscription =
      (api.query.democracy.publicProps() as unknown as Observable<any>)
      .subscribe((proposals) => {
        console.log(proposals);
        setProposals(proposals);
      });
    return () => subscription.unsubscribe();
  });

  const renderProposalRow = (idNumber: BN, proposal: Proposal) => {
    return (
      <ProposalRow
        key={idNumber.toString()}
        proposal={proposal}
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
          <Table.HeaderCell>Runtime Module</Table.HeaderCell>
          <Table.HeaderCell>Votes</Table.HeaderCell>
        </Table.Row>
      </Table.Header>

      <Table.Body>
        {
          publicProposals && publicProposals.map((propo: any) => (
            renderProposalRow(propo[0], propo[1])
          ))
        }
      </Table.Body>
    </Table>
  );
}
