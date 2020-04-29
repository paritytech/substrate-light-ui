// Copyright 2018-2020 @paritytech/Nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';

import { CopyButton } from './CopyButton';
import { mergeClasses } from './util/tachyons';

type AddressProps = {
  address: string;
  className?: string;
  shortened?: boolean;
};

const tachyons = {
  default: 'inline-flex ph3 pv2 ba b--moon-gray br2 code f6',
};

export function Address(props: AddressProps): React.ReactElement {
  const { address, className, shortened } = props;

  return (
    <span className={mergeClasses(tachyons['default'], className)}>
      {shortened
        ? address
            .slice(0, 8)
            .concat('...')
            .concat(address.slice(address.length - 8, address.length))
        : address}
      <CopyButton value={address} />
    </span>
  );
}
