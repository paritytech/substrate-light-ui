// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Margin } from '@substrate/ui-components';
import React from 'react';

import { Proposals } from './Proposals';
import { Referenda } from './Referenda';

export function Democracy (): React.ReactElement {
  return (
    <React.Fragment>
      <Referenda />
      <Margin top='big' />
      <Proposals />
    </React.Fragment>
  );
}
