// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import IdentityIcon from '@polkadot/ui-identicon';
import { SubjectInfo } from '@polkadot/ui-keyring/observable/types';
import React from 'react';
import {
  Dropdown as SUIDropdown,
  DropdownProps as SUIDropdownProps
} from 'semantic-ui-react';

import { Dropdown, DropdownItem, DropdownItemAddress } from './InputAddress.styles';

interface Props extends SUIDropdownProps {
  accounts?: SubjectInfo;
  addresses?: SubjectInfo;
}

const PLACEHOLDER_NAME = 'UNNAMED_ACCOUNT';

export class InputAddress extends React.PureComponent<Props> {

  render () {
    const { accounts, addresses, ...rest } = this.props;

    return (
      <Dropdown
        {...rest}
      >
        <SUIDropdown.Menu>
          {accounts && <SUIDropdown.Header>My Accounts</SUIDropdown.Header>}
          {this.renderItemsFor('accounts')}
          {addresses && <SUIDropdown.Header>My Address Book</SUIDropdown.Header>}
          {this.renderItemsFor('addresses')}
        </SUIDropdown.Menu>
      </Dropdown>
    );
  }

  renderItem = (address: string, name?: string) => {
    return <DropdownItem key={address} value={address}>
      <span>
        <IdentityIcon theme='substrate' size={16} value={address} />
        {name || PLACEHOLDER_NAME}
      </span>
      <DropdownItemAddress>({address})</DropdownItemAddress>
    </DropdownItem>;
  }

  renderItemsFor = (accountsOrAddress: 'accounts' | 'addresses') => {
    const items = this.props[accountsOrAddress];

    if (!items) {
      return [];
    }

    return Object.values(items)
      .map(({ json: { address, meta: { name } } }) => this.renderItem(address, name));
  }
}
