// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { formatNumber } from '@polkadot/util';
import { Card, Menu, Table, Progress, StackedHorizontal, VoteNayButton, VoteYayButton, WrapperDiv } from '@substrate/ui-components';
import { AppContext, Subscribe } from '@substrate/ui-common';

import React, { useContext, useEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { Observable, zip } from 'rxjs';
import { take } from 'rxjs/operators';

interface IProps extends RouteComponentProps {

}

// 'query.democracy.publicPropCount',
//   'query.democracy.referendumCount',

export function Governance (props: IProps) {
  const { api } = useContext(AppContext);
  const [proposalCount, setPropCount] = useState();
  const [referendumCount, setRefCount] = useState()

  useEffect(() => {
    const subscription = zip(
      api.query.democracy.publicPropCount() as unknown as Observable<Text>,
      api.query.democracy.referendumCount() as unknown as Observable<Text>
    )
      .pipe(
        take(1)
      )
      .subscribe(([proposalCount, referendumCount]) => {
        setPropCount(proposalCount);
        setRefCount(referendumCount);
      });
    return () => subscription.unsubscribe();
  });

  return (
    <Card height='100%'>
      <Menu stackable>
        <Menu.Item>Proposals </Menu.Item>
        <Menu.Item>Referendums </Menu.Item>
      </Menu>
      <Card.Header> Proposals </Card.Header>
      <Card.Description> active: {formatNumber(proposalCount)} </Card.Description>
      <Card.Description> pending: {formatNumber(referendumCount)} </Card.Description>

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
          </Table.Body>
        </Table>
      </Card.Content>
    </Card>
  );
}
