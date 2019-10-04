// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import accountObservable from '@polkadot/ui-keyring/observable/accounts';
import addressObservable from '@polkadot/ui-keyring/observable/addresses';
import { SingleAddress } from '@polkadot/ui-keyring/observable/types';
import { TxQueueContext } from '@substrate/ui-common';
import { Header, Menu, Sidebar, WithSpaceAround } from '@substrate/ui-components';
import { findFirst, flatten } from 'fp-ts/lib/Array';
import React, { useContext, useEffect, useState } from 'react';
import { combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';

import { SendBalance } from './SendBalance';
import { TxQueue } from './TxQueue';

interface Props {
  currentAccount: string;
  onHide: () => void;
  visible: boolean;
}

export function Transfer (props: Props) {
  const { currentAccount, onHide, visible } = props;
  const { txQueue } = useContext(TxQueueContext);
  const [allAddresses, setAllAddresses] = useState<SingleAddress[]>([]);

  useEffect(() => {
    const allAddressessub = combineLatest([
      accountObservable.subject.pipe(map(Object.values)),
      addressObservable.subject.pipe(map(Object.values))
    ])
      .pipe(map(flatten))
      .subscribe(setAllAddresses);

    return () => {
      allAddressessub.unsubscribe();
    };
  }, []);

  // Find inside `allAddresses`, the first one that's different than
  // currentAccount. If not found, then take the currentAccount
  const firstDifferentAddress = findFirst(
    allAddresses,
    (singleAddress: SingleAddress) => singleAddress.json.address !== currentAccount
  )
    .map(({ json: { address } }) => address)
    .getOrElse(currentAccount);

  return (
    <Sidebar
      as={Menu}
      animation='slide along'
      direction='right'
      icon='labeled'
      onHide={onHide}
      vertical
      visible={visible}
      width='very wide'
    >
      <WithSpaceAround>
        <Header>Send Funds</Header>
        {txQueue.length
          ? <TxQueue currentAccount={currentAccount} />
          : <SendBalance currentAccount={currentAccount} recipientAddress={firstDifferentAddress} />
        }
      </WithSpaceAround>
    </Sidebar>
  );
}
