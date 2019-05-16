// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AppContext } from '@substrate/ui-common';
import { Table } from '@substrate/ui-components';
import React, { useEffect, useContext } from 'react';

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
  const { idNumber } = props;
  const { api } = useContext(AppContext);
  // const [totalVoteCount, setTotalVoteCount] = useState(0);
  // const [yayVoteCount, setYayVoteCount] = useState(0);
  // const [nayVoteCount, setNayVoteCount] = useState(0);

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