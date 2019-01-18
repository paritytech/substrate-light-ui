// Copyright 2017-2018 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { action, observable } from 'mobx';

export class AccountStore {
  @observable
  address: string | null = null;

  @observable
  name: string = ''; // Account name

  @action
  setAddress = async (address: string) => {
    this.address = address;
  }

  @action
  setName = async (name: string) => {
    this.name = name;
  }

  /**
   * Reinitialize everything
   */
  @action
  clear = async () => {
    this.address = null;
    this.name = '';
  }

  /**
   * Generate a seed phrase and add to keyring
   */
  // generateNewAccount = async () => {
  //
  // };
}
export const accountStore = new AccountStore();
