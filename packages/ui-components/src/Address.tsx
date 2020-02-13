// Copyright 2018-2020 @paritytech/Nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';

import { CopyButton } from './CopyButton';
import { FlexSegment } from './FlexSegment';

type AddressProps = {
  address: string;
  shortened?: boolean;
  zIndex?: number;
};

export function Address(props: AddressProps): React.ReactElement {
  const { address, shortened, zIndex = 0 } = props;

  return (
    <FlexSegment style={{ zIndex: zIndex }}>
      {shortened
        ? address
            .slice(0, 8)
            .concat('......')
            .concat(address.slice(address.length - 8, address.length))
        : address}
      <CopyButton value={address} />
    </FlexSegment>
  );
}
