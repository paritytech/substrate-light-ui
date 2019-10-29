// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import { Dimmer, Loader } from 'semantic-ui-react';

type LoadingProps = {
  active: boolean;
  children?: React.ReactNode | string;
  inline?: boolean;
  inverted?: boolean;
};

export function Loading (props: LoadingProps): React.ReactElement {
  const { active, children, inline = false, inverted = false } = props;
  return (
    <React.Fragment>
      <Dimmer active={active}>
        <Loader active={active} inline={inline} inverted={inverted}>
          {children}
        </Loader>
      </Dimmer>
    </React.Fragment>
  );
}
