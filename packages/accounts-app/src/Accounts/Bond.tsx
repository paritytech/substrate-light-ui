// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

// import { Balance, Stacked, SubHeader, FlexItem, StyledLinkButton, StyledNavButton } from '@substrate/ui-components';
import React from 'react';
import { RouteComponentProps } from 'react-router-dom';

interface MatchParams {
  currentAccount?: string;
}

interface Props extends RouteComponentProps<MatchParams> {}

export function Bond (props: Props) {
  return (
    <div>bonding</div>
  );
}
