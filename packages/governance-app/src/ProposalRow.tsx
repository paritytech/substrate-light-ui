// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Method, Proposal } from '@polkadot/types';
import { Table, Progress, StackedHorizontal, VoteNayButton, VoteYayButton, WrapperDiv } from '@substrate/ui-components';
import React from 'react';

interface IProps {
  key: any;
  proposal: any;
};

export function ProposalRow (props: IProps) {
  const { proposal } = props;
  const { meta, method, section } = Method.findFunction(proposal.callIndex);

  console.log('In render ProposalR Row');
  debugger;

  return (
    <Table.Row>
      <Table.Cell>Block number</Table.Cell>
      <Table.Cell>{section}.{method}</Table.Cell>
      <Table.Cell>Proposed by</Table.Cell>
      <Table.Cell>Seconders</Table.Cell>
      <Table.Cell>Remaining time</Table.Cell>
      <Table.Cell>
        {
          meta && meta.documentation
            ? meta.documentation.join(' ')
            : ''
        }
      </Table.Cell>
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
};