// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import { Icon, FadedText, RefreshButton, Segment } from './index';

type Props = {
  mnemonic?: string,
  onClick?: () => void
};

export default class MnemonicSegment extends React.PureComponent<Props> {
  render () {
    const { mnemonic, onClick } = this.props;

    return (
      <Segment>
        <FadedText style={{ margin: '0 auto' }}> {mnemonic} </FadedText>
        <RefreshButton>
          <Icon onClick={onClick} name='refresh' />
        </RefreshButton>
      </Segment>
    );
  }
}
