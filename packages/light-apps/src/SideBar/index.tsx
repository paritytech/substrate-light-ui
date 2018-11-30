// Copyright 2017-2018 @polkadot/light-apps authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';

type Props = {
  children?: React.ReactNode
};

class SideBar extends React.Component<Props> {
  render () {
    const { children } = this.props;

    return (
      <div>
        WOOOO
        {children}
      </div>
    );
  }
}

export default SideBar;
