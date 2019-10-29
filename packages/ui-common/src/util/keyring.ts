// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Keyring } from '@polkadot/ui-keyring';
import { KeyringAddress } from '@polkadot/ui-keyring/types';
import { isUndefined } from '@polkadot/util';
import { Either, fromOption, tryCatch2v } from 'fp-ts/lib/Either';
import { fromNullable } from 'fp-ts/lib/Option';

enum AddressType {
  Account,
  Address
}

/**
 * Helper function for the 2 functions below
 */
function keyringHelper (type: AddressType, keyring: Keyring, address?: string): Either<Error, KeyringAddress> {
  // Which keyring function to call?
  const keyringFunction = type === AddressType.Account
    ? (addr: string): KeyringAddress | undefined => keyring.getAccount(addr)
    : (addr: string): KeyringAddress | undefined => keyring.getAddress(addr);

  return fromOption(new Error('You need to specify an address'))(fromNullable(address))
    // `keyring.getAddress` might fail: catch and return None if it does, pass on the KeyringAddress otherwise
    .chain((addr) => tryCatch2v(() => keyringFunction(addr), (e) => e as Error))
    .chain((keyringAddress) => tryCatch2v(
      () => {
        if (!isUndefined(keyringAddress)) {
          return keyringAddress;
        }
        throw new Error('The address you are looking for does not exist in keyring');
      },
      (e) => e as Error
    ));
}

/**
 * From an `account` string, check if it's in the keyring, and returns an
 * Either<Error,KeyringAddress>.
 */
export function getKeyringAccount (keyring: Keyring, account?: string): Either<Error, KeyringAddress> {
  return keyringHelper(AddressType.Account, keyring, account);
}

/**
 * From an `address` string, check if it's in the keyring, and returns an
 * Either<Error,KeyringAddress>.
 */
export function getKeyringAddress (keyring: Keyring, address?: string): Either<Error, KeyringAddress> {
  return keyringHelper(AddressType.Address, keyring, address);
}
