// Copyright 2018-2020 @paritytech/Nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import Identicon from '@polkadot/react-identicon';
import { IdentityProps } from '@polkadot/react-identicon/types';
import React from 'react';

interface TableCellAddressProps extends IdentityProps {
  address?: string;
  identityNetwork?: IdentityProps;
  accountName?: string | React.ReactElement;
  shortAddress?: string;
}

export function TableCellAddress(
  props: TableCellAddressProps
): React.ReactElement {
  const { address, accountName, shortAddress, theme = 'polkadot' } = props;
  return (
    <div className='flex items-center'>
      <div>
        <Identicon size={32} value={address} theme={theme} />
      </div>
      <div className='flex flex-column justify-center ml3'>
        <div className='f4 fw6'>{accountName}</div>
        <div className='f6 fw3 code mid-gray'>{shortAddress}</div>
      </div>
    </div>
  );
}
