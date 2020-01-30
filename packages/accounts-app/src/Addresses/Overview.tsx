// Copyright 2018-2020 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { SingleAddress } from '@polkadot/ui-keyring/observable/types';
import { KeyringContext } from '@substrate/context';
import {
  AddressSummary,
  CopyButton,
  Margin,
  Stacked,
  StackedHorizontal,
  SubHeader,
  WithSpace,
  WrapperDiv,
} from '@substrate/ui-components';
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';

function renderAllAddressesFromKeyring(addresses: SingleAddress[]): React.ReactElement {
  return addresses.length ? (
    <>
      {addresses.map((address: SingleAddress) => (
        <React.Fragment key={address.json.address}>
          <Margin top />
          <StackedHorizontal>
            <Link to={`/addresses/${address.json.address}`}>
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
      ))}
    </>
  ) : (
    <p>It looks like you haven&apos;t saved any addresses yet.</p>
  );
}

export function Overview(): React.ReactElement {
  const { addresses } = useContext(KeyringContext);
  return (
    <WrapperDiv>
      <Stacked>
        <SubHeader>Select an address to edit its metadata.</SubHeader>
        <WithSpace>{renderAllAddressesFromKeyring(Object.values(addresses))}</WithSpace>
      </Stacked>
    </WrapperDiv>
  );
}
