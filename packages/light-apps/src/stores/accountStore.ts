// Copyright 2017-2018 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { action, observable } from 'mobx';

export class AccountStore {
  @observable
  address: string = '';

  @observable
  name: string = ''; // Account name

  @observable
  jsonString: string | null = null;

  @observable
  recoveryPhrase: string | null = null;

  @observable
  isImport: boolean = false;

  @action
  setAddress = async (address: string) => {
    this.address = address;
  }

  @action
  setName = async (name: string) => {
    this.name = name;
  }

  @action
  setIsImport = async (isImport: boolean) => {
    this.isImport = isImport;
  }

  @action
  setRecoveryPhrase = async (phrase: string) => {
    this.recoveryPhrase = phrase;
  }

  @action
  setJsonString = async (jsonString: string) => {
    let json = JSON.parse(jsonString);

    if (!json || json.address.length !== 48) {
      throw new Error('File is not valid json');
    }

    this.jsonString = jsonString;
    this.address = json.address;
    if (json.meta && json.meta.name) {
      this.name = json.meta.name;
    }
  }

  /**
   * Reinitialize everything
   */
  @action
  clear = async () => {
    this.address = '';
    this.name = '';
  }
}
export const accountStore = new AccountStore();
