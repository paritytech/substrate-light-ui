// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { SubjectInfo } from '@polkadot/ui-keyring/observable/types';
import { Dropdown, DropdownItemProps } from '@substrate/ui-components';
import React from 'react';

interface Props {
  accounts: SubjectInfo[];
  addresses: SubjectInfo[];
}

export class AddressDropdown extends React.PureComponent<Props> {
  getAccountsAsItems = () => {
    const { accounts } = this.props;

    return Object.values(accounts);
  }

  render () {
    console.log(Dropdown);

    return (
      <p>HELLO</p>
    );
  }
}
