// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Proposal, ReferendumInfo } from '@polkadot/types';
import { Card, Menu, Table, Progress, StackedHorizontal, VoteNayButton, VoteYayButton, WrapperDiv } from '@substrate/ui-components';
import { AppContext, Subscribe } from '@substrate/ui-common';

import React, { useContext, useEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { combineLatest, Observable } from 'rxjs';

interface IProps extends RouteComponentProps {}

// 'query.democracy.publicPropCount',
//   'query.democracy.referendumCount',

export function Governance (props: IProps) {
  const { api } = useContext(AppContext);
  const [proposals, setProposals] = useState();
  const [referenda, setReferenda] = useState();

  useEffect(() => {
    const subscription = combineLatest(
      [
        api.query.democracy.publicProps() as unknown as Observable<Array<Proposal>>,
        api.derive.democracy.referendums() as unknown as Observable<Array<ReferendumInfo>>
      ]
    )
    .subscribe(([proposals, referenda]) => {
      setProposals(proposals);
      setReferenda(referenda);
    });
    return () => subscription.unsubscribe();
  });

  const renderProposalRow = (proposal: Proposal) => {
    console.log(proposal);
    debugger;

    return (
      <Table.Row>
        <Table.Cell>123</Table.Cell>
        <Table.Cell>extrinsic</Table.Cell>
        <Table.Cell>address</Table.Cell>
        <Table.Cell>address</Table.Cell>
        <Table.Cell>time</Table.Cell>
        <Table.Cell>section.method</Table.Cell>
        <Table.Cell>
          <WrapperDiv>
            <StackedHorizontal>
              <Progress size='tiny' />
              <StackedHorizontal>
                <VoteNayButton />
                <VoteYayButton />
              </StackedHorizontal>
            </StackedHorizontal>
          </WrapperDiv>
        </Table.Cell>
      </Table.Row>
    );
  }

  return (
    <Card height='100%'>
      <Menu stackable>
        <Menu.Item>Proposals ({proposals && proposals.length})</Menu.Item>
        <Menu.Item>Referenda ({referenda && referenda.length})</Menu.Item>
      </Menu>

      <Card.Content>
        <Table attached>
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
              proposals && proposals.length && proposals.map((proposal: any) => renderProposalRow(proposal))
            }
          </Table.Body>
        </Table>
      </Card.Content>
    </Card>
  );
}
