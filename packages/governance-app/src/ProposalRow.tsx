// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AccountId, BalanceOf, Method, Option, PropIndex, Proposal, Tuple, Vec } from '@polkadot/types';
import { AppContext } from '@substrate/ui-common';
import { AddressSummary, Progress, Stacked, StackedHorizontal, Table, VoteNayButton, VoteYayButton, WrapperDiv } from '@substrate/ui-components';
import React, { useEffect, useContext, useState } from 'react';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';

interface IProps {
  key: string;
  propIndex: PropIndex;
  proposal: Proposal;
  proposer: AccountId;
};

export function ProposalRow (props: IProps) {
  const { api } = useContext(AppContext);
  const [depositBalance, setDepositBalance] = useState();
  const [depositorAccountIds, setDepositorAccountIds] = useState();
  const { propIndex, proposal, proposer } = props;
  const { meta, method, section } = Method.findFunction(proposal.callIndex);

  useEffect(() => {
    const subscription =
      (api.query.democracy.depositOf(propIndex) as unknown as Observable<Option<Tuple>>)
      .pipe(
        take(1)
      )
      .subscribe((deposit) => {
        let d = deposit.unwrapOr(null);
        if (d) {
          setDepositBalance(d[0].toString());
          // @ts-ignore FIXME tuple not generic
          setDepositorAccountIds(d[1][0]);
        }
      });
    return () => subscription.unsubscribe();
  });

  return (
    <Table.Row>
      <Table.Cell>{propIndex.toString()}</Table.Cell>
      <Table.Cell>{section}.{method}</Table.Cell>
      <Table.Cell><AddressSummary address={proposer.toString()} orientation='horizontal' size='tiny' /></Table.Cell>
      <Table.Cell>{depositorAccountIds && depositorAccountIds.map((id: AccountId) => {
        return <AddressSummary address={id.toString()} orientation='horizontal' size='tiny' />;
      })}</Table.Cell>
      <Table.Cell>Remaining time</Table.Cell>
      <Table.Cell>
        {
          meta && meta.documentation
            ? meta.documentation.join(' ')
            : ''
        }
      </Table.Cell>
      <Table.Cell>Balance: {depositBalance}</Table.Cell>
      <Table.Cell>
        <WrapperDiv>
          <Stacked>
            <Progress size='tiny' />
            <StackedHorizontal>
              <VoteNayButton> Nay </VoteNayButton>
              <VoteYayButton> Yay </VoteYayButton>
            </StackedHorizontal>
          </Stacked>
        </WrapperDiv>
      </Table.Cell>
    </Table.Row>
  );
};