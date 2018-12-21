// Copyright 2017-2018 @polkadot/light-apps authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import { inject, observer } from 'mobx-react';
import { OnboardingStoreInterface } from '../stores/interfaces';

type Props = {
  onboardingStore?: OnboardingStoreInterface
};

@inject('onboardingStore')
@observer
export class Onboarding extends React.Component<Props> {
  render () {
    const {
      onboardingStore
    } = this.props;

    return (
      onboardingStore!.isFirstRun
    );
  }
}
