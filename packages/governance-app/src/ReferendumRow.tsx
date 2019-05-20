// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed un3r the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DerivedReferendumVote } from '@polkadot/api-derive/types';
import { BlockNumber, Method } from '@polkadot/types';
import { AppContext } from '@substrate/ui-common';
import { FadedText, Stacked, SubHeader, Table, VoteNayButton, VoteYayButton, YayNay } from '@substrate/ui-components';
import BN from 'bn.js';
import React, { useEffect, useContext, useReducer, useState } from 'react';
import { Observable, combineLatest } from 'rxjs';

interface IProps {
  idNumber: any;
  referendum: any;
};

const votesReducer = (state: any, action: any) => {
  switch (action.type) {
    case 'YAY':
      const yayVoteCount = state.yayVoteCount + 1;
      const yayVoteBalance = state.yayVoteBalance.add(action.balance);
      return { ...state, yayVoteBalance, yayVoteCount };
    case 'NAY':
      const nayVoteCount = state.nayVoteCount + 1;
      const nayVoteBalance = state.nayVoteBalance.add(action.balance);
      return { ...state, nayVoteBalance, nayVoteCount };
    default:
      throw new Error();
  }
};

export function ReferendumRow (props: IProps) {
  const { idNumber, referendum } = props;
  const { api } = useContext(AppContext);
  const [latestBlockNumber, setLatestBlockNumber] = useState(new BlockNumber());
  const [votesForRef, setVotesFor] = useState();

  const { method, section } = Method.findFunction(referendum.proposal.callIndex);

  // const [totalVoteBalance, setTotalVoteBalance] = useState(new BN(0));
  // const [yayVoteBalance, setYayVoteBalance] = useState(new BN(0));
  // const [nayVoteBalance, setNayVoteBalance] = useState(new BN(0));
  // const [yayVoteCount, setYayVoteCount] = useState(0);
  // const [nayVoteCount, setNayVoteCount] = useState(0);

  const [votes, dispatch] = useReducer(votesReducer, {
    nayVoteBalance: new BN(0),
    nayVoteCount: 0,
    yayVoteBalance: new BN(0),
    yayVoteCount: 0,
    totalVoteBalance: new BN(0)
  });

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
    // votesForRef && votesForRef.reduce({ yayVoteCount, nayVoteCount }, ({ balance, vote }: DerivedReferendumVote) => {
    //   if (vote.ltn(0)) {
    //     handleYay(balance);
    //   } else {
    //     handleNay(balance);
    //   }
    // });
    // setTotalVoteBalance(yayVoteBalance.add(nayVoteBalance));

    votesForRef && votesForRef.forEach((v: DerivedReferendumVote) => {
      if (v.vote.ltn(0)) {
        handleYay(v.balance);
      } else {
        handleNay(v.balance);
      }
    });
  }, [votesForRef]);

  const handleYay = (balance: BN) => {
    dispatch({ type: 'YAY', balance });
  };

  const handleNay = (balance: BN) => {
    dispatch({ type: 'NAY', balance });
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
          <VoteYayButton> Yay </VoteYayButton>
        </Stacked>
      </Table.Cell>
    </Table.Row>
  );
};
