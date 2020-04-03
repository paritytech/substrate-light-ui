// Copyright 2018-2024 @paritytech/lichen authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';
import IdentityIcon from '@polkadot/react-identicon';
import {
  SingleAddress,
  SubjectInfo,
} from '@polkadot/ui-keyring/observable/types';
import { decodeAddress } from '@polkadot/util-crypto';
import React from 'react';
import SUIDropdown, {
  DropdownProps,
} from 'semantic-ui-react/dist/commonjs/modules/Dropdown';
import { DropdownItemProps } from 'semantic-ui-react/dist/commonjs/modules/Dropdown/DropdownItem';
import styled from 'styled-components';

import { MARGIN_SIZES } from './constants';
import { polkadotOfficialTheme } from './globalStyle';
import { Margin } from './Margin';
import { isInstanceOfInjectedExtension } from './util/checkInstanceOf';

export type AddressType = 'accounts' | 'addresses';

export interface InputAddressProps extends DropdownProps {
  accounts?: SubjectInfo | InjectedAccountWithMeta[];
  addresses?: SubjectInfo;
  onChangeAddress?: (address: string) => void;
  types?: AddressType[];
  textLabel?: string;
  margin?: string;
  padding?: string;
  value: string;
  wrapClass?: string;
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
    allAccounts.find((injectedAccount: InjectedAccountWithMeta) => {
      // match public keys
      const current = decodeAddress(injectedAccount.address);
      const target = decodeAddress(address);
      let isEqual = true;
      for (let i = 0; i < current.length; i++) {
        if (current[i] !== target[i]) {
          isEqual = false;
          break;
        }
      }

      return isEqual ? injectedAccount : undefined;
    })
  );
}

const Dropdown = styled<typeof SUIDropdown>(SUIDropdown)`
  &&& {
    border: none;
    border-bottom: 1px solid black;
    border-radius: 0;
    background: ${polkadotOfficialTheme.eggShell};
    > .text,
    .item {
      display: flex;
      align-items: center;
    }
    &.active.dropdown {
      border-color: ${polkadotOfficialTheme.black};
      border-radius: 0 !important;
      .menu {
        border-color: ${polkadotOfficialTheme.eggShell};
        margin-top: 1px;
      }
    }
  }
`;

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
    textLabel,
    value,
    wrapClass = 'mb3',
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
          image={<IdentityIcon value={account.address} size={24} />}
          key={account.address}
          onClick={handleChange}
          value={account.address}
          text={renderDropdownItemText(account)}
        />
      );
    } else {
      return (
        <Dropdown.Item
          image={<IdentityIcon value={account.json.address} size={24} />}
          key={account.json.address}
          onClick={handleChange}
          value={account.json.address}
          text={renderDropdownItemText(account)}
        />
      );
    }
  }

  return (
    <div className={wrapClass}>
      {textLabel && <label>{textLabel}</label>}
      <DropdownWrapper>
        <Dropdown
          fluid
          selection
          labeled
          text={
            currentAddress ? (
              <>
                <IdentityIcon value={value} size={24} />
                {renderDropdownItemText(currentAddress)}
              </>
            ) : (
              'Please select...'
            )
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
    </div>
  );
}
