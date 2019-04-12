// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { IExtrinsic } from '@polkadot/types/types';
import React from 'react';

interface Props {
  extrinsic?: IExtrinsic;
}

export class Checks extends React.Component<Props> {
  render () {
    const { extrinsic } = this.props;

    return <p>CHECKS{extrinsic ? 'OK' : ''}</p>;
  }
}
