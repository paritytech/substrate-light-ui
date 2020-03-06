// Copyright 2018-2020 @paritytech/lichen authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';
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
import { isInstanceOfInjectedExtension } from './util/checkInstanceOf';

export type AddressType = 'accounts' | 'addresses';

export interface InputAddressProps extends DropdownProps {
  accounts?: SubjectInfo | InjectedAccountWithMeta[];
  addresses?: SubjectInfo;
  onChangeAddress?: (address: string) => void;
  types?: AddressType[];
  value: string;
}

/**
 * From the keyring, retrieve the `SingleAddress` from a search target `address` string
 */
function getKeyringAddressFromString(
  allAccounts: SubjectInfo,
  allAddresses: SubjectInfo,
  address: string
): SingleAddress | undefined {
  return allAccounts[address] || allAddresses[address];
}

/**
 * From the extension, retrieve the InjectedAccountWithMeta from a search target `address` string
 */
function getExtensionAddressFromString(
  allAccounts: InjectedAccountWithMeta[],
  address: string
): InjectedAccountWithMeta | undefined {
  return (
    allAccounts &&
    allAccounts.find(
      (injectedAccount: InjectedAccountWithMeta) =>
        injectedAccount.address === address
    )
  );
}

const DropdownItemText = styled.span`
  margin-left: ${MARGIN_SIZES.small};
`;

const DropdownWrapper = styled.div`
  display: flex;
  flex-direction: row;
`;

function renderDropdownItemText(
  account: SingleAddress | InjectedAccountWithMeta
): React.ReactElement {
  if (isInstanceOfInjectedExtension(account)) {
    return (
      <DropdownItemText>
        <strong>{account.meta.name}</strong>
        <Margin as='span' right='small' />({account.address.substr(0, 8)}..
        {account.address.slice(-8)})
      </DropdownItemText>
    );
  } else {
    return (
      <DropdownItemText>
        <strong>{account.json.meta.name}</strong>
        <Margin as='span' right='small' />({account.json.address.substr(0, 8)}..
        {account.json.address.slice(-8)})
      </DropdownItemText>
    );
  }
}

export function InputAddress(props: InputAddressProps): React.ReactElement {
  const {
    accounts = {},
    addresses = {},
    fromKeyring = true, // default to using keyring
    onChangeAddress,
    types = ['accounts'],
    value,
    ...rest
  } = props;

  const currentAddress = fromKeyring
    ? getKeyringAddressFromString(accounts as SubjectInfo, addresses, value)
    : getExtensionAddressFromString(
        accounts as InjectedAccountWithMeta[],
        value
      );

  function handleChange(
    _event: React.MouseEvent<HTMLDivElement, Event>,
    data: DropdownItemProps
  ): void {
    if (data.value && onChangeAddress) {
      onChangeAddress(data.value.toString());
    }
  }

  function renderDropdownItem(
    account: SingleAddress | InjectedAccountWithMeta
  ): React.ReactElement {
    if (isInstanceOfInjectedExtension(account)) {
      return (
        <Dropdown.Item
          image={<IdentityIcon value={account.address} size={20} />}
          key={account.address}
          onClick={handleChange}
          value={account.address}
          text={renderDropdownItemText(account)}
        />
      );
    } else {
      return (
        <Dropdown.Item
          image={<IdentityIcon value={account.json.address} size={20} />}
          key={account.json.address}
          onClick={handleChange}
          value={account.json.address}
          text={renderDropdownItemText(account)}
        />
      );
    }
  }

  return (
    <WrapperDiv>
      <DropdownWrapper>
        <IdentityIcon value={value} size={20} />
        <Margin right='small' />
        <Dropdown
          labeled
          text={
            currentAddress
              ? isInstanceOfInjectedExtension(currentAddress)
                ? currentAddress.meta.name
                : currentAddress.json.meta.name
              : 'Loading...'
          }
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
