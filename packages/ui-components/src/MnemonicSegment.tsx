// Copyright 2018-2020 @paritytech/Nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';

import { Button, FlexSegment, Icon, Paragraph } from './';

type MnemonicSegmentProps = {
  mnemonic?: string;
  onClick?: () => void;
};

export function MnemonicSegment(
  props: MnemonicSegmentProps
): React.ReactElement {
  const { mnemonic, onClick } = props;

  return (
    <FlexSegment>
      <Paragraph faded> {mnemonic} </Paragraph>
      <Button icon onClick={onClick}>
        <Icon name='redo' />
      </Button>
    </FlexSegment>
  );
}
