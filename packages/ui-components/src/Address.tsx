// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';

import { CopyButton } from './CopyButton';
import { FlexSegment } from './FlexSegment';

type AddressProps = {
  address?: string
};

const PLACEHOLDER_ADDRESS = '5'.padEnd(16, 'x');

export function Address (props: AddressProps) {
  const { address } = props;

  return (
    <FlexSegment>
      {address || PLACEHOLDER_ADDRESS}
      <CopyButton value={address} />
    </FlexSegment>
  );
}
