// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import addressObservable from '@polkadot/ui-keyring/observable/addresses';
import { SingleAddress } from '@polkadot/ui-keyring/observable/types';
import { map } from 'rxjs/operators';
import React, { useEffect, useState } from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import { AddressSummary, CopyButton, Margin, Stacked, StackedHorizontal, SubHeader, WithSpace } from '@substrate/ui-components';

interface MatchParams {
  currentAccount: string;
}

interface Props extends RouteComponentProps<MatchParams> { }

export function SavedAddresses (props: Props) {
  return (
    <Stacked>
      <SubHeader> Select an address to edit its metadata. </SubHeader>
      <WithSpace>
        {renderAllAddressesFromKeyring(props)}
      </WithSpace>
    </Stacked>
  );
}

function renderAllAddressesFromKeyring (props: Props) {
  const { match: { params: { currentAccount } } } = props;
  const [addresses, setAddresses] = useState<SingleAddress[]>([]);
  useEffect(() => {
    const addressesSub = addressObservable.subject
      .pipe(map(Object.values))
      .subscribe(setAddresses);

    return () => addressesSub.unsubscribe();
  }, []);

  return (
    addresses.length
      ? addresses.map((address: SingleAddress) =>
        <React.Fragment key={`__locked_${address.json.address}`}>
          <Margin top />
          <StackedHorizontal>
            <Link to={`/addresses/${currentAccount}/${address.json.address}`}>
              <AddressSummary
                address={address.json.address}
                name={address.json.meta.name}
                orientation='horizontal'
                size='small'
              />
            </Link>
            <Margin left />
            <CopyButton value={address.json.address} />
          </StackedHorizontal>
        </React.Fragment>
      )
      : <p> It looks like you haven't saved any addresses yet. </p>
  );
}
