// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { BlockNumber } from '@polkadot/types';
import { AppContext } from '@substrate/ui-common';
import { Menu } from '@substrate/ui-components';
import React from 'react';
import { RouteComponentProps, Link, Switch, Route, Redirect } from 'react-router-dom';
import { Create } from './Create';
import { ImportWithJson } from './ImportWithJson';
import { ImportWithPhrase } from './ImportWithPhrase';
import { Container } from 'semantic-ui-react';

interface Props extends RouteComponentProps { }

type State = {
  blockNumber?: BlockNumber,
  renameModalOpen: boolean,
  backupModalOpen: boolean,
  forgetModalOpen: boolean,
  error?: string,
  success?: string,
  password: string,
  name: string
  newName: string
};

export class AddAccount extends React.PureComponent<Props, State> {
  static contextType = AppContext;

  context!: React.ContextType<typeof AppContext>; // http://bit.ly/typescript-and-react-context

  render() {
    return (
      <Container>
        <Menu>
          <Link to="/accounts/add/generate">
            <Menu.Item>
                Generate new account
            </Menu.Item>
          </Link>
          <Link to="/accounts/add/json">
            <Menu.Item>
              Import from JSON keyfile
            </Menu.Item>
          </Link>
          <Link to="/accounts/add/phrase">
            <Menu.Item>
              Import from passphrase
            </Menu.Item>
          </Link>
        </Menu>

        <Switch>
          <Route path='/accounts/add/generate' component={Create} />
          <Route path='/accounts/add/json' component={ImportWithJson} />
          <Route path='/accounts/add/phrase' component={ImportWithPhrase} />
          <Redirect to='/accounts/add/generate' />
        </Switch>
      </Container>
    );
  }
}