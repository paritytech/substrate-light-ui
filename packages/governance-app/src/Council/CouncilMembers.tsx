// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Tuple, Vector } from '@polkadot/types';
import { AddressSummary, Card, FadedText } from '@substrate/ui-components';
import React from 'react';

// More accurately a Vector<(AccountId, BlockNumber)>
interface IProps {
  activeCouncil: Vector<Tuple>;
}

export function CouncilMembers(props: IProps) {
  const { activeCouncil } = props;

  return activeCouncil.map(([accountId, blockNumber]) => {
    return (
      <Card height='234px' key={accountId.toString()}>
        <Card.Content>
          <AddressSummary address={accountId.toString()} />
          <FadedText>Valid till: {blockNumber.toString()}</FadedText>
        </Card.Content>
      </Card>
    );
  });
}
