// Copyright 2017-2018 @polkadot/light-apps authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { action, observable } from 'mobx';
import localforage from 'localforage';
import { enableLogging } from 'mobx-logger';

import { OnboardingStoreInterface } from './interfaces';

const LS_KEY = `__substrate-light::firstRun`;

export class OnboardingStore implements OnboardingStoreInterface {
  @observable
  isFirstRun?: boolean; // If it's the 1st time the user is running the app

  constructor () {
    // @ts-ignore
    enableLogging();

    localforage.getItem(LS_KEY).then(isFirstRun => {
      if (isFirstRun === undefined) {
        // Set store property to true.
        this.setIsFirstRun(true);
      } else {
        this.setIsFirstRun(isFirstRun as boolean);
      }
    });
  }

  @action
  setIsFirstRun = (isFirstRun: boolean) => {
    this.isFirstRun = isFirstRun;
    this.updateLS();
  }

  updateLS = () => localforage.setItem(LS_KEY, this.isFirstRun);
}

export default new OnboardingStore();
