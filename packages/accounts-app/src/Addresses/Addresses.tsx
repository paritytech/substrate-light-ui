// Copyright 2018-2020 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import { Route, Switch } from 'react-router-dom';

import { Add } from './Add';
import { Edit } from './Edit';
import { Overview } from './Overview';

export function Addresses(): React.ReactElement {
  return (
    <Switch>
      <Route path='/addresses/add' component={Add} />
      <Route path='/addresses/:address' component={Edit} />
      <Route path='/addresses' component={Overview} />
    </Switch>
  );
}
