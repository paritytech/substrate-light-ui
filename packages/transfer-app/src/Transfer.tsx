// Copyright 2018-2020 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import accountObservable from '@polkadot/ui-keyring/observable/accounts';
import addressObservable from '@polkadot/ui-keyring/observable/addresses';
import { SingleAddress } from '@polkadot/ui-keyring/observable/types';
import { TxQueueContext } from '@substrate/context';
import { Header, WrapperDiv } from '@substrate/ui-components';
import { findFirst, flatten } from 'fp-ts/lib/Array';
import React, { useContext, useEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';

import { SendBalance } from './SendBalance';
import { TxQueue } from './TxQueue';

interface MatchParams {
  currentAccount: string;
}

type Props = RouteComponentProps<MatchParams>;

export function Transfer(props: Props): React.ReactElement {
  const {
    match: {
      params: { currentAccount },
    },
  } = props;
  const { txQueue } = useContext(TxQueueContext);
  const [allAddresses, setAllAddresses] = useState<SingleAddress[]>([]);

  useEffect(() => {
    const allAddressessub = combineLatest([
      // eslint-disable-next-line @typescript-eslint/unbound-method
      accountObservable.subject.pipe(map(Object.values)),
      // eslint-disable-next-line @typescript-eslint/unbound-method
      addressObservable.subject.pipe(map(Object.values)),
    ])
      .pipe(map(flatten))
      .subscribe(setAllAddresses);

    return (): void => {
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
    <WrapperDiv>
      <Header>Send Funds</Header>
      {txQueue.length ? (
        <TxQueue currentAccount={currentAccount} />
      ) : (
        <SendBalance currentAccount={currentAccount} recipientAddress={firstDifferentAddress} />
      )}
    </WrapperDiv>
  );
}
