// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { WalletCard } from '@substrate/ui-components';
import { FlexItem, Margin, StackedHorizontal } from '@substrate/ui-components';
import React from 'react';
import { Route, Switch } from 'react-router-dom';

import { Add } from './Add';
import { Edit } from './Edit';
import { SavedAddresses } from './SavedAddresses';

export function ManageAddresses(): React.ReactElement {
  return (
    <WalletCard header='Address Book' height='100%'>
      <StackedHorizontal justifyContent='space-between' alignItems='stretch'>
        <FlexItem>
          <Switch>
            <Route path='/addresses/:currentAccount/:editAddress' component={Edit} />
            <Route component={Add} />
          </Switch>
        </FlexItem>
        <Margin left />
        <FlexItem>
          <Route path='/addresses/:currentAccount' component={SavedAddresses} />
        </FlexItem>
      </StackedHorizontal>
    </WalletCard>
  );
}
