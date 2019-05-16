// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed un3r the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AppContext } from '@substrate/ui-common';
import { Table } from '@substrate/ui-components';
import React, { useEffect, useContext, useState } from 'react';
// import { votes } from '@polkadot/api-derive/democracy';

interface IProps {
  idNumber: any;
  key: string;
  referendum: any;
};

export function ReferendumRow (props: IProps) {
  const { idNumber, key, referendum } = props;
  const { api } = useContext(AppContext);
  const [votesForRef, setVotesFor] = useState();
  // const [totalVoteCount, setTotalVoteCount] = useState(0);
  // const [yayVoteCount, setYayVoteCount] = useState(0);
  // const [nayVoteCount, setNayVoteCount] = useState(0);

  useEffect(() => {
    const subscription = (api.derive.democracy.referendumVotesFor(idNumber))
      .subscribe(votesForRef => {
        setVotesFor(votesForRef);
      });
    return () => subscription.unsubscribe();
  });

  // referendum.end => BlockNumber
  // referendum.proposal => Map
  // referendum.threshold => Proposal
  // referendum.delay => BlockNumber

  return (
    <Table.Row>
      <Table.Cell>{votesForRef}</Table.Cell>
      <Table.Cell>{referendum}</Table.Cell>
    </Table.Row>
  );
};