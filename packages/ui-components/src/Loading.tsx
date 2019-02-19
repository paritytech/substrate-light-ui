// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import { Dimmer, Loader } from 'semantic-ui-react';

const Loading = ({ active, children = null }) => (
  <React.Fragment>
    <Dimmer active={true}>
      <Loader>
        Loading
      </Loader>
      {children}
    </Dimmer>
  </React.Fragment>
);

export default Loading;
