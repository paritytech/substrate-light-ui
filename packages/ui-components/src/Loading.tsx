// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import { Dimmer, Loader } from 'semantic-ui-react';

export type LoadingProps = {
  active: boolean,
  children?: React.ReactNode | string
};

export function Loading (props: LoadingProps) {
  const { active, children } = props;
  return (
    <React.Fragment>
      <Dimmer active={active}>
        <Loader>
          {children}
        </Loader>
      </Dimmer>
    </React.Fragment>
  );
}
