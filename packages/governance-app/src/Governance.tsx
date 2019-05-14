// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import { AppContext } from '@substrate/ui-common';
import { Card, Menu } from '@substrate/ui-components';
import BN from 'bn.js';
import React, { useEffect, useContext, useState } from 'react';
import { Redirect, Route, RouteComponentProps, Switch } from 'react-router-dom';
import { Observable } from 'rxjs';

import { Proposals } from './Proposals';

interface MatchParams {
  currentAccount: string;
}

interface IProps extends RouteComponentProps<MatchParams> {}

export function Governance (props: IProps) {
  const { api } = useContext(AppContext);
  const [propCount, setCount] = useState();

  useEffect(() => {
    const subscription =
      (api.query.democracy.publicPropCount() as unknown as Observable<BN>)
        .subscribe((count) => {
          setCount(count);
        });
    return () => subscription.unsubscribe();
  });

  const navToProposals = () => {
    props.history.push(`/governance/${props.match.params.currentAccount}/proposals`);
  };

  return (
    <Card height='100%'>
      <Menu stackable>
        <Menu.Item onClick={navToProposals}>Proposals ({propCount && propCount.toString()})</Menu.Item>
        <Menu.Item>Referenda ()</Menu.Item>
      </Menu>

      <Card.Content>
        <Switch>
          <Route path='/governance/:currentAccount/proposals' component={Proposals} />
          <Redirect exact from='/governance/:currentAccount' to='/governance/:currentAccount/proposals' />
        </Switch>
      </Card.Content>
    </Card>
  );
}
