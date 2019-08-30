// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Option, Tuple } from '@polkadot/types';
import { AccountId, Index, PropIndex, Proposal } from '@polkadot/types/interfaces';
import { AppContext, TxQueueContext, validateDerived } from '@substrate/ui-common';
import { AddressSummary, Dropdown, FadedText, StackedHorizontal, StyledNavButton, SubHeader, Table } from '@substrate/ui-components';
import BN from 'bn.js';
import React, { useEffect, useContext, useState } from 'react';
import { Observable, Subscription, combineLatest } from 'rxjs';
import { take } from 'rxjs/operators';
import { DerivedFees, DerivedBalances } from '@polkadot/api-derive/types';

interface IProps {
  key: string;
  propIndex: PropIndex;
  proposal: Proposal;
  proposer: AccountId;
}
export function ProposalRow (props: IProps) {
  const { propIndex, proposal, proposer } = props;
  const { api, keyring } = useContext(AppContext);
  const { enqueue } = useContext(TxQueueContext);
  const [accountNonce, setCurrentNonce] = useState();
  const [fees, setFees] = useState();
  const [depositedBalance, setDepositedBalance] = useState();
  const [depositorAccountIds, setDepositorAccountIds] = useState();
  const [votingBalance, setVotingBalance] = useState();
  const { meta, method, section } = api.findCall(proposal.callIndex);

  const currentAccount = location.pathname.split('/')[2];

  useEffect(() => {
    const subscription: Subscription = combineLatest([
      (api.query.democracy.depositOf(propIndex) as Observable<Option<Tuple>>),
      (api.derive.balances.fees() as Observable<DerivedFees>),
      (api.query.system.accountNonce(currentAccount) as Observable<Index>),
      (api.derive.balances.votingBalance(currentAccount) as Observable<DerivedBalances>)
    ])
    .pipe(
      take(1)
    )
    .subscribe(([deposit, fees, nonce, votingBalance]) => {
      // @type deposit: Option<(BalanceOf,Vec<AccountId>)>
      let d = deposit.unwrapOr(null);
      if (d) {
        setDepositedBalance(d[0].toString());
        setDepositorAccountIds(d[1]);
      }
      setCurrentNonce(nonce);
      setFees(fees);
      setVotingBalance(votingBalance);
    });
    return () => subscription.unsubscribe();
  });

  const handleSeconding = () => {
    const extrinsic = api.tx.democracy.second(propIndex);
    // @ts-ignore works in test...
    const values = validateDerived({ accountNonce, amount: new BN(0), currentBalance: votingBalance, extrinsic, fees, recipientBalance: undefined });

    values.fold(
      (errors: any) => alert({ type: 'error', content: errors }),
      (allExtrinsicData: any) => {
        const { allTotal, allFees, amount, extrinsic } = allExtrinsicData;
        const details = { amount, allFees, allTotal, methodCall: extrinsic.meta.name.toString(), senderPair: keyring.getPair(currentAccount), recipientAddress: undefined };

        enqueue(extrinsic, details);
      }
    );
  };

  return (
    <Table.Row>
      <Table.Cell>{propIndex.toString()}</Table.Cell>
      <Table.Cell>{section}.{method}</Table.Cell>
      <Table.Cell>
        {
          meta && meta.documentation && meta.documentation.join(' ') || 'No Description Available'
        }
      </Table.Cell>
      <Table.Cell><AddressSummary address={proposer.toString()} noBalance orientation='vertical' size='tiny' /></Table.Cell>
      <Table.Cell>
        <Dropdown icon={
          depositorAccountIds
            ? <React.Fragment>
              <FadedText>View All</FadedText>
              <SubHeader noMargin>{depositorAccountIds.length}</SubHeader>
              <FadedText>Seconders</FadedText>
            </React.Fragment>
            : ''
        } scrolling>
          <Dropdown.Menu>
            {renderSecondersList(depositorAccountIds)}
          </Dropdown.Menu>
        </Dropdown>
      </Table.Cell>
      <Table.Cell>{depositedBalance}</Table.Cell>
      <Table.Cell>
        <StackedHorizontal>
          {
            depositorAccountIds && depositorAccountIds.find((depositor: AccountId): boolean => depositor.eq(currentAccount))
              ? <FadedText>Already Seconded!</FadedText>
              : <StyledNavButton onClick={handleSeconding}> Second </StyledNavButton>
          }
        </StackedHorizontal>
      </Table.Cell>
    </Table.Row>
  );
}

function renderSecondersList (accountIds: Array<AccountId>) {
  if (accountIds && accountIds.length) {
    return accountIds.map((accountId: AccountId) => {
      return (
        <Dropdown.Item key={accountId.toString()}>
          <AddressSummary address={accountId.toString()} orientation='vertical' size='tiny' />
        </Dropdown.Item>
      );
    });
  } else {
    return <FadedText> No Seconders Yet </FadedText>;
  }
}
