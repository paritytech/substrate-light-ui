// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Validators } from '@substrate/accounts-app';
import { Container } from '@substrate/ui-components';
import { RouteComponentProps } from 'react-router-dom';
import React from 'react';

interface MatchParams {
  currentAccount: string;
}

interface Props extends RouteComponentProps<MatchParams> {
  currentAccount: string;
}

export function ShowValidators (props: Props): React.ReactElement {
  const { match: { params: { currentAccount } } } = props;

  return (
    <Container>
      <Validators currentAccount={currentAccount} {...props} />
    </Container>
  );
}
