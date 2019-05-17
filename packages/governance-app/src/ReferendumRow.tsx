// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed un3r the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DerivedReferendumVote } from '@polkadot/api-derive/types';
import { AccountId, BlockNumber, Method, Vector } from '@polkadot/types';
import { AppContext } from '@substrate/ui-common';
import { Stacked, StackedHorizontal, Table, WrapperDiv, VoteNayButton, VoteYayButton, YayNay } from '@substrate/ui-components';
import BN from 'bn.js';
import React, { useEffect, useContext, useState } from 'react';
import { Observable, combineLatest } from 'rxjs';

interface IProps {
  idNumber: any;
  referendum: any;
};

export function ReferendumRow (props: IProps) {
  const { idNumber, referendum } = props;
  const { api } = useContext(AppContext);
  const [latestBlockNumber, setLatestBlockNumber] = useState();
  const [votesForRef, setVotesFor] = useState();
  const [votersFor, setVotersFor] = useState();
  const { method, section } = Method.findFunction(referendum.proposal.callIndex);

  // const [totalVoteBalance, setTotalVoteBalance] = useState(new BN(0));
  const [yayVoteBalance, setYayVoteBalance] = useState(new BN(0));
  const [nayVoteBalance, setNayVoteBalance] = useState(new BN(0));
  const [yayVoteCount, setYayVoteCount] = useState(0);
  const [nayVoteCount, setNayVoteCount] = useState(0);

  useEffect(() => {
    const subscription = combineLatest([
      api.derive.chain.bestNumber() as unknown as Observable<BlockNumber>,
      api.derive.democracy.referendumVotesFor(idNumber) as unknown as Observable<Array<DerivedReferendumVote>>,
      api.query.democracy.votersFor(idNumber) as unknown as Observable<Vector<AccountId>>
    ])
    .subscribe(([latestBlockNumber, votesForRef, votersFor]) => {
      setLatestBlockNumber(latestBlockNumber);
      setVotesFor(votesForRef);
      setVotersFor(votersFor);
    });

    return () => subscription.unsubscribe();
  }, []);

  console.log(votersFor);

  useEffect(() => {
    votesForRef && votesForRef.forEach((v: DerivedReferendumVote) => {
      if (v.vote.ltn(0)) {
        setYayVoteCount(yayVoteCount + 1);
        setYayVoteBalance(yayVoteBalance.add(v.balance));
      } else {
        setNayVoteCount(nayVoteCount + 1);
        setNayVoteBalance(nayVoteBalance.add(v.balance));
      }
    });
  }, [votesForRef]);

  return (
    <Table.Row>
      <Table.Cell>{idNumber.toString()}</Table.Cell>
      <Table.Cell>{method}.{section}</Table.Cell>
      <Table.Cell>{referendum.delay.toString()} </Table.Cell>
      <Table.Cell>{votesForRef && votesForRef.length}</Table.Cell>
      <Table.Cell>{referendum.end - latestBlockNumber} Blocks Remaining</Table.Cell>
      <Table.Cell>
        <Stacked>
          <WrapperDiv width='100%'>
            {referendum.threshold.toString()}
            <YayNay aye={yayVoteCount} nay={nayVoteCount} />
          </WrapperDiv>
          <StackedHorizontal>
            <VoteNayButton> Nay </VoteNayButton>
            <VoteYayButton> Yay </VoteYayButton>
          </StackedHorizontal>
        </Stacked>
      </Table.Cell>
    </Table.Row>
  );
}
