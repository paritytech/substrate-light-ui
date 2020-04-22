// Copyright 2018-2020 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Header, Menu } from '@substrate/ui-components';
import React from 'react';
import { Redirect, Route, RouteComponentProps, Switch } from 'react-router-dom';

import { Create } from './Create/CreateAccount';
import { RestoreWithJson } from './Restore/WithJson';
import { RestoreWithPhrase } from './Restore/WithPhrase';

type Props = RouteComponentProps;

export function AddAccount(props: Props): React.ReactElement {
  const { history, location } = props;

  const activeTab = location.pathname.split('/')[3];

  const navToCreate = (): void => {
    history.push(`/accounts/add/generate`);
  };

  const navToImportJson = (): void => {
    history.push(`/accounts/add/json`);
  };

  const navToImportSeed = (): void => {
    history.push(`/accounts/add/phrase`);
  };

  return (
    <>
      <Header>Add an Account</Header>
      <Menu borderless shadow={false} size='large' text>
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
        <Route path='/accounts/add/generate' component={Create} />
        <Route path='/accounts/add/json' component={RestoreWithJson} />
        <Route path='/accounts/add/phrase' component={RestoreWithPhrase} />
        <Redirect to='/accounts/add/generate' />
      </Switch>
    </>
  );
}
