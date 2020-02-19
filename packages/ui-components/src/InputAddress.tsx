// Copyright 2018-2020 @paritytech/Nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import IdentityIcon from '@polkadot/react-identicon';
import {
  SingleAddress,
  SubjectInfo,
} from '@polkadot/ui-keyring/observable/types';
import React from 'react';
import Dropdown, {
  DropdownProps,
} from 'semantic-ui-react/dist/commonjs/modules/Dropdown';
import { DropdownItemProps } from 'semantic-ui-react/dist/commonjs/modules/Dropdown/DropdownItem';
import styled from 'styled-components';

import { MARGIN_SIZES } from './constants';
import { Margin } from './Margin';
import { WrapperDiv } from './Shared.styles';

export type AddressType = 'accounts' | 'addresses';

export interface InputAddressProps extends DropdownProps {
  accounts?: SubjectInfo;
  addresses?: SubjectInfo;
  onChangeAddress?: (address: string) => void;
  types?: AddressType[];
  value: string;
}

/**
 * From the keyring, retrieve the `SingleAddress` from an `address` string
 */
function getAddressFromString(
  allAccounts: SubjectInfo,
  allAddresses: SubjectInfo,
  address: string
): SingleAddress | undefined {
  return allAccounts[address] || allAddresses[address];
}

const DropdownItemText = styled.span`
  margin-left: ${MARGIN_SIZES.small};
`;

const DropdownWrapper = styled.div`
  display: flex;
  flex-direction: row;
`;

function renderDropdownItemText(address: SingleAddress): React.ReactElement {
  return (
    <DropdownItemText>
      <strong>{address.json.meta.name}</strong>
      <Margin as='span' right='small' />({address.json.address.substr(0, 8)}..
      {address.json.address.slice(-8)})
    </DropdownItemText>
  );
}

export function InputAddress(props: InputAddressProps): React.ReactElement {
  const {
    accounts = {},
    addresses = {},
    onChangeAddress,
    types = ['accounts'],
    value,
    ...rest
  } = props;

  const currentAddress = getAddressFromString(accounts, addresses, value);

  function handleChange(
    _event: React.MouseEvent<HTMLDivElement, Event>,
    data: DropdownItemProps
  ): void {
    if (data.value && onChangeAddress) {
      onChangeAddress(data.value.toString());
    }
  }

  function renderDropdownItem(address: SingleAddress): React.ReactElement {
    return (
      <Dropdown.Item
        image={<IdentityIcon value={address.json.address} size={20} />}
        key={address.json.address}
        onClick={handleChange}
        value={address.json.address}
        text={renderDropdownItemText(address)}
      />
    );
  }

  return (
    <WrapperDiv>
      <DropdownWrapper>
        <IdentityIcon value={value} size={20} />
        <Margin right='small' />
        <Dropdown
          labeled
          text={currentAddress ? currentAddress.json.meta.name : 'Loading...'}
          value={value}
          {...rest}
        >
          <Dropdown.Menu>
            {types.includes('accounts') && Object.keys(accounts).length > 0 && (
              <Dropdown.Header>My accounts</Dropdown.Header>
            )}
            {types.includes('accounts') &&
              Object.values(accounts).map(renderDropdownItem)}
            {types.includes('addresses') &&
              Object.keys(addresses).length > 0 && (
                <Dropdown.Header>My addresses</Dropdown.Header>
              )}
            {types.includes('addresses') &&
              Object.values(addresses).map(renderDropdownItem)}
          </Dropdown.Menu>
        </Dropdown>
      </DropdownWrapper>
    </WrapperDiv>
  );
}
