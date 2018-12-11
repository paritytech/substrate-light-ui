// Copyright 2017-2018 @polkadot/light-apps authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import { IdentityAppStyles } from './identityAppStyles';

import { BareProps } from '@polkadot/ui-components/';

import React from 'react';

type Props = BareProps & {
  basePath: string
};

type State = {
  hidden: Array<string>,
  items: Array<string>
};

export class Identity extends React.PureComponent<Props, State> {
  state: State;

  constructor (props: Props) {
    super(props);

    this.state = {
      hidden: [],
      items: []
    };
  }

  componentDidMount = () => {
    console.log('identity app mounted');
  }

  render () {
    return (
      <IdentityAppStyles>
        <main className='identity--App'>
          Identity App
        </main>
      </IdentityAppStyles>
    );
  }
}
