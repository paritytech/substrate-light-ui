// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed un3r the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DerivedReferendumVote } from '@polkadot/api-derive/types';
import { AccountId, BlockNumber, Method, Option, ReferendumInfo, Vector } from '@polkadot/types';
import { AppContext } from '@substrate/ui-common';
import { StackedHorizontal, Table, VoteNayButton, VoteYayButton } from '@substrate/ui-components';
import React, { useEffect, useContext, useState } from 'react';
import { Observable, combineLatest } from 'rxjs';
// import { votes } from '@polkadot/api-derive/democracy';

interface IProps {
  idNumber: any;
  key: string;
  referendum: any;
};

export function ReferendumRow (props: IProps) {
  const { idNumber, key, referendum } = props;
  const { api } = useContext(AppContext);
  const [latestBlockNumber, setLatestBlockNumber] = useState();
  const [referendumInfo, setReferendumInfo] = useState();
  const [votesForRef, setVotesFor] = useState();
  const [votersForRef, setVotersFor] = useState();
  const { meta, method, section } = Method.findFunction(referendum.proposal.callIndex);

  // const [totalVoteCount, setTotalVoteCount] = useState(0);
  // const [yayVoteCount, setYayVoteCount] = useState(0);
  // const [nayVoteCount, setNayVoteCount] = useState(0);

  useEffect(() => {
    const subscription = combineLatest([
      api.derive.democracy.referendumVotesFor(idNumber) as unknown as Observable<Array<DerivedReferendumVote>>,
      api.derive.chain.bestNumber() as unknown as Observable<BlockNumber>,
      api.query.democracy.referendumInfoOf(idNumber) as unknown as Observable<Option<ReferendumInfo>>,
      api.query.democracy.votersFor(idNumber) as unknown as Observable<Vector<AccountId>>
    ])
      .subscribe(([votesForRef, latestBlockNumber, referendumInfo, votersForRef]) => {
        setVotesFor(votesForRef);
        setLatestBlockNumber(latestBlockNumber);
        setReferendumInfo(referendumInfo);
        setVotersFor(votersForRef);
      });

    return () => subscription.unsubscribe();
  });

  useEffect(() => {
    debugger;
    console.log(referendumInfo);
    console.log(votersForRef);
  });
  // referendum.end => BlockNumber
  // referendum.proposal => Map
  // referendum.threshold => Proposal
  // referendum.delay => BlockNumber
  return (
    <Table.Row>
      <Table.Cell>ID #</Table.Cell>
      <Table.Cell>Proposal: {method}.{section}</Table.Cell>
      <Table.Cell>Referendum Info: {referendumInfo.toString()}</Table.Cell>
      <Table.Cell>Voting Period:</Table.Cell>
      <Table.Cell>Voters For: {votesForRef}</Table.Cell>
      <Table.Cell>Time Remaining</Table.Cell>
      <Table.Cell>
        <StackedHorizontal>
          <VoteNayButton> Nay </VoteNayButton>
          <VoteYayButton> Yay </VoteYayButton>
        </StackedHorizontal>
      </Table.Cell>
    </Table.Row>
  );
}
