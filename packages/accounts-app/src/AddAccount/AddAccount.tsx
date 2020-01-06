// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Header, WrapperDiv } from '@substrate/ui-components';
import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

import { Create } from './Create/CreateAccount';
import { ImportWithJson } from './ImportWithJson';
import { ImportWithPhrase } from './ImportWithPhrase';

// FIXME
// const MENUS = [
//   {
//     label: 'Generate new account',
//     route: 'generate',
//   },
//   {
//     label: 'Import from JSON keyfile',
//     route: 'json',
//   },
//   {
//     label: 'Import from mnemonic phrase',
//     route: 'phrase',
//   },
// ];

export function AddAccount(): React.ReactElement {
  return (
    <WrapperDiv>
      <Header>Add an Account</Header>
      <Switch>
        <Route path='/accounts/:currentAccount/add/generate' component={Create} />
        <Route path='/accounts/:currentAccount/add/json' component={ImportWithJson} />
        <Route path='/accounts/:currentAccount/add/phrase' component={ImportWithPhrase} />
      </Switch>
    </WrapperDiv>
  );
}
