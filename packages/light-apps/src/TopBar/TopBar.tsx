// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Header } from '@polkadot/types';
import { AppContext } from '@substrate/ui-common';
import { FadedText, NavLink, StackedHorizontal, Margin } from '@substrate/ui-components';
import React, { useContext, useEffect, useState } from 'react';
import { Observable } from 'rxjs';

import { BlockCounter, NodeStatus } from './TopBar.styles';
import substrateLogo from '@polkadot/ui-assets/parity-substrate.svg';
import { Link, Route, Switch } from 'react-router-dom';

interface Props {}

export function TopBar (props: Props) {
  const { api, system: { chain, health: { isSyncing }, name, version } } = useContext(AppContext);

  const [blockNumber, setBlockNumber] = useState();
  useEffect(() => {
    const chainHeadSub = (api.rpc.chain.subscribeNewHead() as Observable<Header>)
      .subscribe((header) => setBlockNumber(header.blockNumber));

    return () => {
      chainHeadSub.unsubscribe();
    };
  }, [api, setBlockNumber]);

  return (
    <header>
      <Margin top='medium' />
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
          <Route path={['/addresses', '/accounts/add']}>
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
