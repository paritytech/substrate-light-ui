// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';

import { CopyButton } from './CopyButton';
import { FlexSegment } from './FlexSegment';

type AddressProps = {
  address: string,
  shortened?: boolean
};

export function Address (props: AddressProps) {
  const { address, shortened } = props;

  return (
    <FlexSegment>
      {
        shortened
          ? address.slice(0, 8).concat('......').concat(address.slice(address.length - 8, address.length))
          : address
      }
      <CopyButton value={address} />
    </FlexSegment>
  );
}
