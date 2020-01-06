// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Header, Menu, WrapperDiv } from '@substrate/ui-components';
import React from 'react';
import { Redirect, Route, RouteComponentProps, Switch } from 'react-router-dom';

import { Create } from './Create/CreateAccount';
import { ImportWithJson } from './ImportWithJson';
import { ImportWithPhrase } from './ImportWithPhrase';

type Props = RouteComponentProps;

export function AddAccount(props: Props): React.ReactElement {
  const { history, location } = props;

  const currentAccount = location.pathname.split('/')[2];
  const activeTab = location.pathname.split('/')[4];

  const navToCreate = () => {
    history.push(`/accounts/${currentAccount}/add/generate`);
  };

  const navToImportJson = () => {
    history.push(`/accounts/${currentAccount}/add/json`);
  };

  const navToImportSeed = () => {
    history.push(`/accounts/${currentAccount}/add/phrase`);
  };

  return (
    <WrapperDiv>
      <Header>Add an Account</Header>
      <Menu>
        <Menu.Item active={activeTab === 'generate'} onClick={navToCreate}>
          Create New
        </Menu.Item>
        <Menu.Item active={activeTab === 'json'} onClick={navToImportJson}>
          Import with Json
        </Menu.Item>
        <Menu.Item active={activeTab === 'phrase'} onClick={navToImportSeed}>
          Import with Seed
        </Menu.Item>
      </Menu>
      <Switch>
        <Route path='/accounts/:currentAccount/add/generate' component={Create} />
        <Route path='/accounts/:currentAccount/add/json' component={ImportWithJson} />
        <Route path='/accounts/:currentAccount/add/phrase' component={ImportWithPhrase} />
        <Redirect exact from='/accounts' to='/accounts/:currentAccount/add/generate' />
      </Switch>
    </WrapperDiv>
  );
}
