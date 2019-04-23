// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { Margin, Stacked, SubHeader } from '@substrate/ui-components';

import { SaveAddress } from './SaveAddress';

interface Props extends RouteComponentProps<{}> { }

export class Add extends React.PureComponent<Props> {
  render () {
    return (
      <Stacked>
        <SubHeader> Inspect the status of any identity and name it for later use </SubHeader>
        <Margin top />
        <SaveAddress />
      </Stacked>
    );
  }
}
