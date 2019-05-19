// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed un3r the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DerivedReferendumVote } from '@polkadot/api-derive/types';
import { AccountId, BlockNumber, Method, Vector } from '@polkadot/types';
import { AppContext } from '@substrate/ui-common';
import { FadedText, Stacked, StackedHorizontal, SubHeader, Table, WrapperDiv, VoteNayButton, VoteYayButton, YayNay } from '@substrate/ui-components';
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
  const [latestBlockNumber, setLatestBlockNumber] = useState(new BlockNumber());
  const [votesForRef, setVotesFor] = useState();
  const { method, section } = Method.findFunction(referendum.proposal.callIndex);

  const [totalVoteBalance, setTotalVoteBalance] = useState(new BN(0));
  const [yayVoteBalance, setYayVoteBalance] = useState(new BN(0));
  const [nayVoteBalance, setNayVoteBalance] = useState(new BN(0));
  const [yayVoteCount, setYayVoteCount] = useState(0);
  const [nayVoteCount, setNayVoteCount] = useState(0);

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
    votesForRef && votesForRef.forEach((v: DerivedReferendumVote) => {
      if (v.vote.ltn(0)) {
        setYayVoteCount(yayVoteCount + 1);
        setYayVoteBalance(yayVoteBalance.add(v.balance));
      } else {
        setNayVoteCount(nayVoteCount + 1);
        setNayVoteBalance(nayVoteBalance.add(v.balance));
      }
    });
    setTotalVoteBalance(yayVoteBalance.add(nayVoteBalance));
  }, [votesForRef]);

  return (
    <Table.Row>
      <Table.Cell>{idNumber.toString()}</Table.Cell>
      <Table.Cell>{method}.{section}</Table.Cell>
      <Table.Cell>{referendum.delay.toString()} Blocks </Table.Cell>
      <Table.Cell>
        <Stacked>
          <b>Count:</b><FadedText>{votesForRef && votesForRef.length}</FadedText>
          <b>Balance:</b><FadedText>{totalVoteBalance.toNumber()}</FadedText>
        </Stacked>
      </Table.Cell>
      <Table.Cell>{referendum.end - latestBlockNumber.toNumber()} Blocks Remaining</Table.Cell>
      <Table.Cell>
          <Stacked>
            <SubHeader>{referendum.threshold.toString()}</SubHeader>
            <YayNay yay={yayVoteCount} nay={nayVoteCount} />
            <StackedHorizontal>
                <VoteNayButton> Nay </VoteNayButton>
                <VoteYayButton> Yay </VoteYayButton>
            </StackedHorizontal>
          </Stacked>
      </Table.Cell>
    </Table.Row>
  );
};
