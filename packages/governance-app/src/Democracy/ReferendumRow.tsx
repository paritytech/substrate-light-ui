// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed un3r the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DerivedReferendumVote } from '@polkadot/api-derive/types';
import { BlockNumber, Method } from '@polkadot/types';
import { AppContext } from '@substrate/ui-common';
import { FadedText, Margin, Stacked, SubHeader, Table, VoteNayButton, VoteYayButton, YayNay } from '@substrate/ui-components';
import BN from 'bn.js';
import React, { useEffect, useContext, useReducer, useState } from 'react';
import { Observable, combineLatest } from 'rxjs';

interface IProps {
  idNumber: any;
  referendum: any;
}

const votesReducer = (state: any, action: any) => {
  switch (action.type) {
    case 'NEW_VOTE':
      const newState = action.votes && action.votes.reduce((state: any, v: DerivedReferendumVote) => {
        if (v.vote.ltn(0)) {
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
  const { api } = useContext(AppContext);
  const [latestBlockNumber, setLatestBlockNumber] = useState(new BlockNumber());
  const [votesForRef, setVotesFor] = useState();
  const [votes, dispatch] = useReducer(votesReducer, {
    nayVoteBalance: new BN(0),
    nayVoteCount: 0,
    yayVoteBalance: new BN(0),
    yayVoteCount: 0,
    totalVoteBalance: new BN(0)
  });

  const { method, section } = Method.findFunction(referendum.proposal.callIndex);

  useEffect(() => {
    const subscription = combineLatest([
      api.derive.chain.bestNumber() as unknown as Observable<BlockNumber>,
      api.derive.democracy.referendumVotesFor(idNumber) as unknown as Observable<Array<DerivedReferendumVote>>
    ])
    .subscribe(([latestBlockNumber, votesForRef]) => {
      setLatestBlockNumber(latestBlockNumber);
      setVotesFor(votesForRef);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    votesForRef && handleNewVote(votesForRef);
  }, [votesForRef]);

  const handleNewVote = (votes: Array<DerivedReferendumVote>) => {
    dispatch({ type: 'NEW_VOTE', votes });
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
          <VoteNayButton> Nay </VoteNayButton>
          <Margin top />
          <VoteYayButton> Yay </VoteYayButton>
        </Stacked>
      </Table.Cell>
    </Table.Row>
  );
}
