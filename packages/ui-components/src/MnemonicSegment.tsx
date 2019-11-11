// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';

import { Icon, FadedText, FlexSegment, RefreshButton } from './';

type MnemonicSegmentProps = {
  mnemonic?: string;
  onClick?: () => void;
};

export function MnemonicSegment (props: MnemonicSegmentProps): React.ReactElement {
  const { mnemonic, onClick } = props;

  return (
    <FlexSegment>
      <FadedText style={{ margin: '0 auto' }}> {mnemonic} </FadedText>
      <RefreshButton>
        <Icon onClick={onClick} name='refresh' />
      </RefreshButton>
    </FlexSegment>
  );
}
