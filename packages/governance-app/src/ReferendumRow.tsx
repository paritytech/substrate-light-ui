// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed un3r the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DerivedReferendumVote } from '@polkadot/api-derive/types';
import { BlockNumber, Method } from '@polkadot/types';
import { AppContext } from '@substrate/ui-common';
import { Progress, Stacked, StackedHorizontal, Table, WrapperDiv, VoteNayButton, VoteYayButton } from '@substrate/ui-components';
import React, { useEffect, useContext, useState } from 'react';
import { Observable, combineLatest } from 'rxjs';
// import { votes } from '@polkadot/api-derive/democracy';

interface IProps {
  idNumber: any;
  referendum: any;
};

export function ReferendumRow (props: IProps) {
  const { idNumber, referendum } = props;
  const { api } = useContext(AppContext);
  const [latestBlockNumber, setLatestBlockNumber] = useState();
  const [votesForRef, setVotesFor] = useState();
  const { method, section } = Method.findFunction(referendum.proposal.callIndex);

  // const [totalVoteCount, setTotalVoteCount] = useState(0);
  // const [yayVoteCount, setYayVoteCount] = useState(0);
  // const [nayVoteCount, setNayVoteCount] = useState(0);

  // referendum.end => BlockNumber
  // referendum.proposal => Map
  // referendum.threshold => Proposal
  // referendum.delay => BlockNumber

  // api.query.democracy.referendumInfoOf(idNumber) as unknown as Observable<Option<ReferendumInfo>>,
  //   api.query.democracy.votersFor(idNumber) as unknown as Observable<Vector<AccountId>>
  useEffect(() => {
    const subscription = combineLatest([
      api.derive.democracy.referendumVotesFor(idNumber) as unknown as Observable<Array<DerivedReferendumVote>>,
      api.derive.chain.bestNumber() as unknown as Observable<BlockNumber>
    ])
    .subscribe(([votesForRef, latestBlockNumber]) => {
      setVotesFor(votesForRef);
      setLatestBlockNumber(latestBlockNumber);
    });

    return () => subscription.unsubscribe();
  }, []);

  console.log(votesForRef);

  return (
    <Table.Row>
      <Table.Cell>{idNumber.toString()}</Table.Cell>
      <Table.Cell>{method}.{section}</Table.Cell>
      <Table.Cell>{referendum.delay.toString()} </Table.Cell>
      <Table.Cell>Voters For: </Table.Cell>
      <Table.Cell>{referendum.end - latestBlockNumber} Blocks Remaining</Table.Cell>
      <Table.Cell>
        <Stacked>
          <WrapperDiv width='100%'>
            {referendum.threshold.toString()}

            <Progress size='tiny' />

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
