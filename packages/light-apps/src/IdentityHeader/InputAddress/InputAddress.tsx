// Copyright 2018-2020 @paritytech/Nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import {
  InputAddress as InputAddressPure,
  InputAddressProps,
} from '@substrate/ui-components';
import React, { useContext } from 'react';

import { KeyringContext } from '../../ContextGate/context';

export function InputAddress(props: InputAddressProps): React.ReactElement {
  const { accounts, addresses } = useContext(KeyringContext);

  return (
    <InputAddressPure accounts={accounts} addresses={addresses} {...props} />
  );
}
