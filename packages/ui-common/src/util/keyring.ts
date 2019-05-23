// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Keyring } from '@polkadot/ui-keyring';
import { KeyringAddress } from '@polkadot/ui-keyring/types';
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
  const keyringFunction = (type === AddressType.Account ? keyring.getAccount : keyring.getAddress).bind(keyring);

  return fromOption(new Error('You need to specify an address'))(fromNullable(address))
    // `keyring.getAddress` might fail: catch and return None if it does
    .chain((addr) => tryCatch2v(() => keyringFunction(addr), (e) => e as Error))
    .chain((keyringAddress) => tryCatch2v(
      () => {
        // If `.getMeta` doesn't throw, then it mean the address exists
        // https://github.com/polkadot-js/ui/issues/133
        keyringAddress.getMeta();
        return keyringAddress;
      },
      (e) => e as Error)
    );
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
