// Copyright 2017-2018 @polkadot/light-apps authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import { I18nProps } from '@polkadot/ui-components/';
import './index.css';

import React from 'react';

type Props = I18nProps & {
  basePath: string
};

type State = {};

export class Governance extends React.PureComponent<Props, State> {
  state: State;

  constructor (props: Props) {
    super(props);

    this.state = {};
  }

  render () {
    return (
      <main className='governance--App'>
        Governance
      </main>
    );
  }
}
