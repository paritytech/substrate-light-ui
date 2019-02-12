// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { action, observable } from 'mobx';
import { enableLogging } from 'mobx-logger';
import store from 'store';

const LS_KEY = `__substrate-light::firstRun`;
const NODE_ENV = process.env.NODE_ENV;

export class OnboardingStore {
  @observable isFirstRun = false;

  constructor () {
    if (NODE_ENV !== 'production') {
      enableLogging();
    }

    const isFirstRun = store.get(LS_KEY);

    if (isFirstRun === undefined) {
      this.setIsFirstRun(true);
    } else {
      this.setIsFirstRun(isFirstRun as boolean);
    }
  }

  @action
  setIsFirstRun = (isFirstRun: boolean) => {
    this.isFirstRun = isFirstRun;
    this.updateLS();
  }

  updateLS = () => store.set(LS_KEY, this.isFirstRun);
}

export const onboardingStore = new OnboardingStore();
