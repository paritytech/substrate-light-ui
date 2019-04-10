// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { BlockNumber, Header } from '@polkadot/types';
import { AppContext } from '@substrate/ui-common';
import { FadedText, NavLink, StackedHorizontal, Margin } from '@substrate/ui-components';
import React from 'react';
import { Observable, Subscription } from 'rxjs';

import { BlockCounter, NodeStatus } from './TopBar.styles';
import substrateLogo from '@polkadot/ui-assets/parity-substrate.svg';
import { Link, Route, Switch } from 'react-router-dom';

type State = {
  blockNumber?: BlockNumber,
  backupModalOpen: boolean,
  forgetModalOpen: boolean,
  error?: string,
  success?: string,
  password: string
};

export class TopBar extends React.PureComponent<{}, State> {
  static contextType = AppContext;

  context!: React.ContextType<typeof AppContext>; // http://bit.ly/typescript-and-react-context

  state: State = {
    backupModalOpen: false,
    forgetModalOpen: false,
    password: ''
  };

  chainHeadSub?: Subscription;

  componentDidMount () {
    this.subscribeChainHead();
  }

  componentWillUnmount () {
    this.closeAllSubscriptions();
  }

  closeAllSubscriptions () {
    if (this.chainHeadSub) {
      this.chainHeadSub.unsubscribe();
      this.chainHeadSub = undefined;
    }
  }

  subscribeChainHead = () => {
    const { api } = this.context;

    this.chainHeadSub = (api.rpc.chain.subscribeNewHead() as Observable<Header>)
      .subscribe((header) => this.setState({ blockNumber: header.blockNumber }));
  }

  render () {
    const { system: { chain, health, name, version } } = this.context;
    const { blockNumber } = this.state;

    const isSyncing = health.isSyncing;

    return (
      <header>
        <StackedHorizontal justifyContent='space-between' alignItems='flex-end'>
          <div>
            <StackedHorizontal alignItems='flex-end'>
              <div>
                <NavLink to='/'>
                  <img
                    src={substrateLogo}
                    width={150}
                  />
                </NavLink>
                <FadedText> {name} {version} </FadedText>
              </div>
              <Margin left='medium' />
              <div>
                <NodeStatus isSyncing={isSyncing} />
                <BlockCounter blockNumber={blockNumber} chainName={chain} />
              </div>
            </StackedHorizontal>
          </div>
          <Switch>
            <Route path='/addresses'>
              <Link to={`/`}>
                Back
              </Link>
            </Route>
            <Route>
              <Link to={`/addresses`}>
                Manage address book
              </Link>
            </Route>
          </Switch>
        </StackedHorizontal>
      </header>
    );
  }
}
