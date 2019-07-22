// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed un3r the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DerivedReferendumVote, DerivedFees, DerivedBalances } from '@polkadot/api-derive/types';
import { BlockNumber, Method, Nonce } from '@polkadot/types';
import { AppContext, TxQueueContext, validateDerived } from '@substrate/ui-common';
import { FadedText, Margin, Stacked, SubHeader, Table, VoteNayButton, VoteYayButton, YayNay } from '@substrate/ui-components';
import BN from 'bn.js';
import React, { useEffect, useContext, useReducer, useState } from 'react';
import { Observable, combineLatest } from 'rxjs';

interface IProps {
  idNumber: any;
  referendum: any;
}

// FIXME: also get Convictions if they exist
const votesReducer = (state: any, action: any) => {
  switch (action.type) {
    case 'NEW_VOTE':
      const newState = action.votes && action.votes.reduce((state: any, v: DerivedReferendumVote) => {
        if (v.vote.isAye) {
          state.yayVoteCount++;
          state.yayVoteBalance = state.yayVoteBalance.add(v.balance);
        } else {
          state.nayVoteCount++;
          state.nayVoteBalance = state.nayVoteBalance.add(v.balance);
        }

        state.voteCount++;
        state.totalVoteBalance = state.totalVoteBalance.add(v.balance);

        return state;
      },
        {
          nayVoteBalance: new BN(0),
          nayVoteCount: 0,
          yayVoteBalance: new BN(0),
          yayVoteCount: 0,
          totalVoteBalance: new BN(0)
        });
      return newState;
    default:
      throw new Error();
  }
};

export function ReferendumRow (props: IProps) {
  const { idNumber, referendum } = props;
  const { api, keyring } = useContext(AppContext);
  const { enqueue } = useContext(TxQueueContext);
  const [accountNonce, setNonce] = useState();
  const [latestBlockNumber, setLatestBlockNumber] = useState(new BlockNumber());
  const [fees, setFees] = useState();
  const [votesForRef, setVotesFor] = useState();
  const [votingBalance, setVotingBalance] = useState();
  const [votes, dispatch] = useReducer(votesReducer, {
    nayVoteBalance: new BN(0),
    nayVoteCount: 0,
    yayVoteBalance: new BN(0),
    yayVoteCount: 0,
    totalVoteBalance: new BN(0)
  });

  const { method, section } = Method.findFunction(referendum.proposal.callIndex);

  const currentAccount = location.pathname.split('/')[2];

  useEffect(() => {
    const subscription = combineLatest([
      (api.derive.chain.bestNumber() as unknown as Observable<BlockNumber>),
      (api.derive.balances.fees() as Observable<DerivedFees>),
      (api.query.system.accountNonce(currentAccount) as Observable<Nonce>),
      (api.derive.democracy.referendumVotesFor(idNumber) as unknown as Observable<Array<DerivedReferendumVote>>),
      (api.derive.balances.votingBalance(currentAccount) as Observable<DerivedBalances>)
    ])
    .subscribe(([latestBlockNumber, fees, nonce, votesForRef, votingBalance]) => {
      setLatestBlockNumber(latestBlockNumber);
      setFees(fees);
      setNonce(nonce);
      setVotesFor(votesForRef);
      setVotingBalance(votingBalance);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    votesForRef && handleNewVote(votesForRef);
  }, [votesForRef]);

  const handleNewVote = (votes: Array<DerivedReferendumVote>) => {
    dispatch({ type: 'NEW_VOTE', votes });
  };

  const handleVote = ({ currentTarget: { dataset: { vote } } }: React.MouseEvent<HTMLElement>) => {
    const extrinsic = api.tx.democracy.vote(idNumber, vote === 'yay');

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
      <Table.Cell>{idNumber.toString()}</Table.Cell>
      <Table.Cell>{method}.{section}</Table.Cell>
      <Table.Cell>{referendum.delay.toString()} Blocks </Table.Cell>
      <Table.Cell>
        <Stacked>
          <b>Count:</b><FadedText>{votes.yayVoteCount + votes.nayVoteCount}</FadedText>
          <b>Balance:</b><FadedText>{votes.totalVoteBalance.toNumber()}</FadedText>
        </Stacked>
      </Table.Cell>
      <Table.Cell>{referendum.end - latestBlockNumber.toNumber()} Blocks Remaining</Table.Cell>
      <Table.Cell>
        <Stacked justifyContent='flex-start'>
          <SubHeader>{referendum.threshold.toString()}</SubHeader>
          <YayNay yay={votes.yayVoteBalance.toNumber()} nay={votes.nayVoteBalance.toNumber()} />
        </Stacked>
      </Table.Cell>
      <Table.Cell>
        <Stacked>
          <VoteNayButton onClick={handleVote} data-vote='nay'> Nay </VoteNayButton>
          <Margin top />
          <VoteYayButton onClick={handleVote} data-vote='yay'> Yay </VoteYayButton>
        </Stacked>
      </Table.Cell>
    </Table.Row>
  );
}
