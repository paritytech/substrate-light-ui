// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AccountId, Method, Option, PropIndex, Proposal, Tuple } from '@polkadot/types';
import { AppContext } from '@substrate/ui-common';
import { AddressSummary, Progress, Stacked, StackedHorizontal, Table, VoteNayButton, VoteYayButton, WrapperDiv } from '@substrate/ui-components';
import React, { useEffect, useContext, useState } from 'react';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';

interface IProps {
  idNumber: any;
  key: string;
  value: any;
};

// const SecondersList = (accountIds: any) => {
//   return accountIds && accountIds.forEach((accountId: AccountId) => {
//     return (
//       <AddressSummary address={accountId.toString()} orientation='horizontal' size='tiny' />
//     );
//   });
// };

export function ReferendumRow (props: IProps) {
  const { idNumber, key, value } = props;
  const { api } = useContext(AppContext);
  const [totalVoteCount, setTotalVoteCount] = useState(0);
  const [yayVoteCount, setYayVoteCount] = useState(0);
  const [nayVoteCount, setNayVoteCount] = useState(0);

  useEffect(() => {
    const subscription = (api.derive.democracy.referendumVotesFor(idNumber))
      .subscribe(votesForRef => {
        console.log(votesForRef);
        debugger;
      });
    return () => subscription.unsubscribe();
  });

  return (
    <Table.Row>
      <Table.Cell>just testing....</Table.Cell>
    </Table.Row>
  );
};