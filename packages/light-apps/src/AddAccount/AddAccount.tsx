// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

<<<<<<< HEAD
import { AppContext } from '@substrate/ui-common';
import { Menu, WalletCard } from '@substrate/ui-components';
=======
import { BlockNumber } from '@polkadot/types';
import { AppContext } from '@substrate/ui-common';
import { Menu } from '@substrate/ui-components';
>>>>>>> 7f1650e1585b7f2a51dd8eb8fb0dbde23b1b093a
import React from 'react';
import { RouteComponentProps, Link, Switch, Route, Redirect } from 'react-router-dom';
import { Create } from './Create';
import { ImportWithJson } from './ImportWithJson';
import { ImportWithPhrase } from './ImportWithPhrase';
import { Container } from 'semantic-ui-react';

interface Props extends RouteComponentProps { }

type State = {
<<<<<<< HEAD
  activeTab: string
=======
  blockNumber?: BlockNumber,
  renameModalOpen: boolean,
  backupModalOpen: boolean,
  forgetModalOpen: boolean,
  error?: string,
  success?: string,
  password: string,
  name: string
  newName: string
>>>>>>> 7f1650e1585b7f2a51dd8eb8fb0dbde23b1b093a
};

export class AddAccount extends React.PureComponent<Props, State> {
  static contextType = AppContext;

<<<<<<< HEAD
  state: State = {
    activeTab: 'generate'
  };

  context!: React.ContextType<typeof AppContext>; // http://bit.ly/typescript-and-react-context

  componentWillReceiveProps (nextProps: any) {
    if (nextProps.location !== this.props.location) {
      this.setState({
        activeTab: nextProps.location.pathname.split('/')[3]
      });
    }
  }

  render () {
    const { activeTab } = this.state;

=======
  context!: React.ContextType<typeof AppContext>; // http://bit.ly/typescript-and-react-context

  render () {
>>>>>>> 7f1650e1585b7f2a51dd8eb8fb0dbde23b1b093a
    return (
      <Container>
        <Menu>
          <Link to='/accounts/add/generate'>
<<<<<<< HEAD
            <Menu.Item active={activeTab === 'generate'}>
=======
            <Menu.Item>
>>>>>>> 7f1650e1585b7f2a51dd8eb8fb0dbde23b1b093a
                Generate new account
            </Menu.Item>
          </Link>
          <Link to='/accounts/add/json'>
<<<<<<< HEAD
            <Menu.Item active={activeTab === 'json'}>
=======
            <Menu.Item>
>>>>>>> 7f1650e1585b7f2a51dd8eb8fb0dbde23b1b093a
              Import from JSON keyfile
            </Menu.Item>
          </Link>
          <Link to='/accounts/add/phrase'>
<<<<<<< HEAD
            <Menu.Item active={activeTab === 'phrase'}>
=======
            <Menu.Item>
>>>>>>> 7f1650e1585b7f2a51dd8eb8fb0dbde23b1b093a
              Import from mnemonic phrase
            </Menu.Item>
          </Link>
        </Menu>

<<<<<<< HEAD
        <WalletCard header='Add an Account' height='100%'>
          <Switch>
            <Route path='/accounts/add/generate' component={Create} />
            <Route path='/accounts/add/json' component={ImportWithJson} />
            <Route path='/accounts/add/phrase' component={ImportWithPhrase} />
            <Redirect to='/accounts/add/generate' />
          </Switch>
        </WalletCard>
=======
        <Switch>
          <Route path='/accounts/add/generate' component={Create} />
          <Route path='/accounts/add/json' component={ImportWithJson} />
          <Route path='/accounts/add/phrase' component={ImportWithPhrase} />
          <Redirect to='/accounts/add/generate' />
        </Switch>
>>>>>>> 7f1650e1585b7f2a51dd8eb8fb0dbde23b1b093a
      </Container>
    );
  }
}
