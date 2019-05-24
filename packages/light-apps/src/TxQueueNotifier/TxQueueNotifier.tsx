// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AlertsContext, AppContext, TxQueueContext } from '@substrate/ui-common';
import { Message, StackedHorizontal, TxSummary } from '@substrate/ui-components';
import React, { useContext, useEffect } from 'react';

export function TxQueueNotifier () {
  const { errorObservable, successObservable } = useContext(TxQueueContext);
  const { enqueue } = useContext(AlertsContext);
  const { system: { properties: { tokenSymbol } } } = useContext(AppContext);

  // Display notification on success
  useEffect(() => {
    const subscription = successObservable.subscribe((details) => {
      const { amount, recipientAddress, senderPair } = details;

      const content = (
        <Message.Content>
          <StackedHorizontal justifyContent='space-around'>
            <span>Transaction Completed!</span>
            <TxSummary
              amount={amount}
              recipientAddress={recipientAddress}
              senderAddress={senderPair.address()}
              tokenSymbol={tokenSymbol}
            />
          </StackedHorizontal>
        </Message.Content>
      );

      enqueue({
        content: content,
        type: 'success'
      });
    });

    return () => subscription.unsubscribe();
  }, [successObservable, enqueue]);

  // Display notification on error
  useEffect(() => {
    const subscription = errorObservable.subscribe((details: any) => {
      const { error } = details;

      const content = (
        <Message.Content>
          <Message.Header>Error! </Message.Header>
          <Message.Content > {error} </Message.Content>
        </Message.Content>
      );

      enqueue({
        content: content,
        type: 'error'
      });
    });

    return subscription.unsubscribe();
  }, [errorObservable, enqueue]);

  return null;
}
