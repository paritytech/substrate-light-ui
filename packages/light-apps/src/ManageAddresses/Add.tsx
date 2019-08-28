// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Margin, Stacked, SubHeader } from '@substrate/ui-components';
import React from 'react';

import { SaveAddress } from './SaveAddress';

export function Add () {
  return (
    <Stacked>
      <SubHeader> Enter an ddress and save it with a name for later use. </SubHeader>
      <Margin top />
      <SaveAddress />
    </Stacked>
  );
}
