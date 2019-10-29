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

type Props = RouteComponentProps<MatchParams>;

function renderAllAddressesFromKeyring (addresses: SingleAddress[], currentAccount: string): React.ReactElement {
  return (
    addresses.length
      ? (
        <>
          {addresses.map((address: SingleAddress) =>
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
          )}
        </>
      )
      : <p> It looks like you haven&apos;t saved any addresses yet. </p>
  );
}

export function SavedAddresses (props: Props): React.ReactElement {
  const { match: { params: { currentAccount } } } = props;
  const [addresses, setAddresses] = useState<SingleAddress[]>([]);
  useEffect(() => {
    const addressesSub = addressObservable.subject
      // eslint-disable-next-line @typescript-eslint/unbound-method
      .pipe(map(Object.values))
      .subscribe(setAddresses);

    return (): void => addressesSub.unsubscribe();
  }, []);

  return (
    <Stacked>
      <SubHeader> Select an address to edit its metadata. </SubHeader>
      <WithSpace>
        {renderAllAddressesFromKeyring(addresses, currentAccount)}
      </WithSpace>
    </Stacked>
  );
}
