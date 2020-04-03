// Copyright 2018-2020 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Header, WrapperDiv } from '@substrate/ui-components';
import React from 'react';

import { SendBalance } from './SendBalance';

export function Transfer(): React.ReactElement {
  return (
    <WrapperDiv>
      <Header>Send Funds</Header>
      <SendBalance />
    </WrapperDiv>
  );
}
