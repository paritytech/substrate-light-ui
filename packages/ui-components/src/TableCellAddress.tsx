// Copyright 2018-2020 @paritytech/Nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import Identicon from '@polkadot/react-identicon';
import React from 'react';

interface TableCellAddressProps {
  address?: string;
  publicKey?: string;
  accountName?: string;
  shortAddress?: string;
}

export function TableCellAddress(
  props: TableCellAddressProps
): React.ReactElement {
  const { address, publicKey, accountName, shortAddress } = props;
  return (
    <div className='flex items-center'>
      <div>
        <Identicon
          size='32'
          state={{
            address: address,
            publicKey: publicKey,
          }}
        />
      </div>
      <div className='flex flex-column justify-center ml3'>
        <div className='f5 fw5'>{accountName}</div>
        <div className='f6 fw1 code silver'>{shortAddress}</div>
      </div>
    </div>
  );
}
