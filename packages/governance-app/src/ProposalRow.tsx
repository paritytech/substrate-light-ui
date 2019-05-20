// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AccountId, Method, Option, PropIndex, Proposal, Tuple } from '@polkadot/types';
import { AppContext } from '@substrate/ui-common';
import { AddressSummary, FadedText, StackedHorizontal, StyledNavButton, Table } from '@substrate/ui-components';
import React, { useEffect, useContext, useState } from 'react';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';

interface IProps {
  key: string;
  propIndex: PropIndex;
  proposal: Proposal;
  proposer: AccountId;
}

const renderSecondersList = (accountIds: Array<AccountId>) => {
  if (accountIds && accountIds.length) {
    console.log('account ids =>', accountIds);
    return accountIds.map((accountId: AccountId) => {
      return (
        <AddressSummary address={accountId.toString()} orientation='vertical' size='tiny' />
      );
    });
  } else {
    return <FadedText> No Seconders Yet </FadedText>;
  }
};

export function ProposalRow (props: IProps) {
  const { propIndex, proposal, proposer } = props;
  const { api } = useContext(AppContext);
  const [depositedBalance, setDepositedBalance] = useState();
  const [depositorAccountIds, setDepositorAccountIds] = useState();
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
          setDepositedBalance(d[0].toString());
          // @ts-ignore FIXME tuple not generic
          setDepositorAccountIds(d[1][0]);
        }
      });
    return () => subscription.unsubscribe();
  }, []);

  return (
    <Table.Row>
      <Table.Cell>{propIndex.toString()}</Table.Cell>
      <Table.Cell>{section}.{method}</Table.Cell>
      <Table.Cell>
        {
          meta && meta.documentation && meta.documentation.join(' ') || 'No Description Available'
        }
      </Table.Cell>
      <Table.Cell><AddressSummary address={proposer.toString()} orientation='vertical' size='tiny' /></Table.Cell>
      <Table.Cell>{renderSecondersList(depositorAccountIds)}</Table.Cell>
      <Table.Cell>{depositedBalance}</Table.Cell>
      <Table.Cell>
        <StackedHorizontal>
          <StyledNavButton> Second </StyledNavButton>
        </StackedHorizontal>
      </Table.Cell>
    </Table.Row>
  );
};