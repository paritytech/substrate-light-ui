// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import { Dimmer, Loader } from 'semantic-ui-react';

type Props = {
  active: boolean,
  children?: React.ReactNode | string
};

class Loading extends React.PureComponent<Props> {
  render () {
    const { active, children } = this.props;
    return (
      <React.Fragment>
        <Dimmer active={active}>
          <Loader>
            Loading
          </Loader>
          {children}
        </Dimmer>
      </React.Fragment>
    );
  }
}

export default Loading;
