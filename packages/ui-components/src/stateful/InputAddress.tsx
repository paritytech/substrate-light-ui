// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import IdentityIcon from '@polkadot/react-identicon';
import keyringAccounts from '@polkadot/ui-keyring/observable/accounts';
import keyringAddresses from '@polkadot/ui-keyring/observable/addresses';
import { SingleAddress, SubjectInfo } from '@polkadot/ui-keyring/observable/types';
import React, { useEffect, useState } from 'react';
import { combineLatest } from 'rxjs';
import Dropdown, { DropdownProps } from 'semantic-ui-react/dist/commonjs/modules/Dropdown';
import { DropdownItemProps } from 'semantic-ui-react/dist/commonjs/modules/Dropdown/DropdownItem';
import styled from 'styled-components';

import { MARGIN_SIZES } from '../constants';
import { Margin } from '../Margin';

type AddressType = 'accounts' | 'addresses';

export interface InputAddressProps extends DropdownProps {
  onChangeAddress?: (address: string) => any;
  types?: AddressType[];
  value: string;
}

const DropdownItemText = styled.span`
  margin-left: ${MARGIN_SIZES.small};
`;

/**
 * From the keyring, retrieve the `SingleAddress` from an `address` string
 */
function getAddressFromString (allAccounts: SubjectInfo, allAddresses: SubjectInfo, address: string): SingleAddress | undefined {
  return allAccounts[address] || allAddresses[address];
}

function renderDropdownItemText (address: SingleAddress): React.ReactElement {
  return (
    <DropdownItemText>
      <strong>{address.json.meta.name}</strong>
      <Margin as='span' right='small' />
      ({address.json.address.substr(0, 3)}..{address.json.address.slice(-3)})
    </DropdownItemText>
  );
}

export function InputAddress (props: InputAddressProps): React.ReactElement {
  const { onChangeAddress, types = ['accounts'], value, ...rest } = props;
  const [accounts, setAccounts] = useState<SubjectInfo>({});
  const [addresses, setAddresses] = useState<SubjectInfo>({});

  const currentAddress = getAddressFromString(accounts, addresses, value);

  useEffect(() => {
    const subscription = combineLatest([
      keyringAccounts.subject,
      keyringAddresses.subject
    ]).subscribe(([acc, add]) => {
      setAccounts(acc);
      setAddresses(add);
    });

    return (): void => subscription.unsubscribe();
  }, []);

  function handleChange (_event: React.MouseEvent<HTMLDivElement, Event>, data: DropdownItemProps): void {
    if (data.value && onChangeAddress) {
      onChangeAddress(data.value.toString());
    }
  }

  function renderDropdownItem (address: SingleAddress): React.ReactElement {
    return <Dropdown.Item
      image={<IdentityIcon value={address.json.address} size={20} />}
      key={address.json.address}
      onClick={handleChange}
      value={address.json.address}
      text={renderDropdownItemText(address)}
    />;
  }

  return (
    <>
      <IdentityIcon value={value} size={20} />
      <Margin right='small' />
      <Dropdown
        labeled
        text={currentAddress ? currentAddress.json.meta.name : 'Loading...'}
        value={value}
        {...rest}
      >
        <Dropdown.Menu>
          {types.includes('accounts') && Object.keys(accounts).length > 0 && <Dropdown.Header>My accounts</Dropdown.Header>}
          {types.includes('accounts') && Object.values(accounts).map(renderDropdownItem)}
          {types.includes('addresses') && Object.keys(addresses).length > 0 && <Dropdown.Header>My addresses</Dropdown.Header>}
          {types.includes('addresses') && Object.values(addresses).map(renderDropdownItem)}
        </Dropdown.Menu>
      </Dropdown>
    </>
  );
}
