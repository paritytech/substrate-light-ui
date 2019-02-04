// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import { Redirect } from 'react-router-dom';

const defaultTo = '/identity';

export class NotFound extends React.PureComponent {
  render () {
    return (
      <Redirect to={defaultTo} />
    );
  }
}
