// Copyright 2018-2020 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { TxQueueContext } from '@substrate/context';
import { Header, WrapperDiv } from '@substrate/ui-components';
import React, { useContext } from 'react';

import { SendBalance } from './SendBalance';
import { TxQueue } from './TxQueue';

export function Transfer(): React.ReactElement {
  const { txQueue } = useContext(TxQueueContext);

  return (
    <WrapperDiv>
      <Header>Send Funds</Header>
      {txQueue.length ? <TxQueue /> : <SendBalance />}
    </WrapperDiv>
  );
}
