// Copyright 2018-2020 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { KeyringContext, TxQueueContext } from '@substrate/context';
import { Header, WrapperDiv } from '@substrate/ui-components';
import { findFirst } from 'fp-ts/lib/Array';
import React, { useContext } from 'react';
import { RouteComponentProps } from 'react-router-dom';

import { SendBalance } from './SendBalance';
import { TxQueue } from './TxQueue';

interface MatchParams {
  sender: string;
}

type Props = RouteComponentProps<MatchParams>;

export function Transfer(props: Props): React.ReactElement {
  const {
    match: {
      params: { sender },
    },
  } = props;
  const { accounts, addresses } = useContext(KeyringContext);
  const { txQueue } = useContext(TxQueueContext);

  // Find inside `allAddresses`, the first one that's different than
  // currentAccount. If not found, then take the currentAccount
  const firstDifferentAddress = findFirst(
    Object.values(addresses).concat(Object.values(accounts)),
    ({ json }) => json.address !== sender
  )
    .map(({ json: { address } }) => address)
    .getOrElse(sender);

  return (
    <WrapperDiv>
      <Header>Send Funds</Header>
      {txQueue.length ? (
        <TxQueue currentAccount={sender} />
      ) : (
        <SendBalance currentAccount={sender} recipientAddress={firstDifferentAddress} />
      )}
    </WrapperDiv>
  );
}
