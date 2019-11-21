// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Menu } from '@substrate/ui-components';
import React from 'react';
import { Link, Redirect, Route, RouteComponentProps, Switch } from 'react-router-dom';
import { Container } from 'semantic-ui-react';

import { Create } from '../AddAccount/Create/CreateAccount';
import { WalletCard } from '../components';
import { ImportWithJson } from './ImportWithJson';
import { ImportWithPhrase } from './ImportWithPhrase';

interface MatchParams {
  currentAccount: string;
}

type Props = RouteComponentProps<MatchParams>;

const MENUS = [
  {
    label: 'Generate new account',
    route: 'generate',
  },
  {
    label: 'Import from JSON keyfile',
    route: 'json',
  },
  {
    label: 'Import from mnemonic phrase',
    route: 'phrase',
  },
];

export function AddAccount(props: Props): React.ReactElement {
  const activeTab = props.location.pathname.split('/')[4]; // FIXME Is there a better way to do that?
  const {
    match: {
      params: { currentAccount },
    },
  } = props;

  return (
    <Container>
      <Menu>
        {MENUS.map(({ label, route }) => (
          <Link key={route} to={`/accounts/${currentAccount}/add/${route}`}>
            <Menu.Item active={activeTab === route}>{label}</Menu.Item>
          </Link>
        ))}
      </Menu>

      <WalletCard header='Add an Account' height='100%'>
        <Switch>
          <Route path='/accounts/:currentAccount/add/generate' component={Create} />
          <Route path='/accounts/:currentAccount/add/json' component={ImportWithJson} />
          <Route path='/accounts/:currentAccount/add/phrase' component={ImportWithPhrase} />
          <Redirect to='/accounts/:currentAccount/add/generate' />
        </Switch>
      </WalletCard>
    </Container>
  );
}
