// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { FlexItem, Margin, StackedHorizontal, WalletCard } from '@substrate/ui-components';
import React from 'react';
import { Route, Switch } from 'react-router-dom';

import { Add } from './Add';
import { Edit } from './Edit';
import { SavedAddresses } from './SavedAddresses';

export function ManageAddresses(): React.ReactElement {
  return (
    <Switch>
      <Route path='/addresses/:currentAccount/:editAddress' component={Edit} />
      <Route path='/addresses/add' component={Add} />
      <Route path='/addresses/:currentAccount' component={SavedAddresses} />
    </Switch>
  );
}
