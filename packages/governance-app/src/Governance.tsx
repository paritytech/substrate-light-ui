// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import { BlockNumber } from '@polkadot/types';
import { AppContext } from '@substrate/ui-common';
import { Card, Menu, WrapperDiv } from '@substrate/ui-components';
import BN from 'bn.js';
import React, { useEffect, useContext, useState } from 'react';
import { Redirect, Route, RouteComponentProps, Switch } from 'react-router-dom';
import { combineLatest, Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import Progress from 'semantic-ui-react/dist/commonjs/modules/Progress/Progress';

import { Proposals } from './Proposals';
import { Referenda } from './Referenda';

interface MatchParams {
  currentAccount: string;
}

interface IProps extends RouteComponentProps<MatchParams> {}

export function Governance (props: IProps) {
  const { api } = useContext(AppContext);
  const [propCount, setPropCount] = useState();
  const [refCount, setRefCount] = useState();
  const [launchPeriod, setLaunchPeriod] = useState();
  const [latestBlockNumber, setLatestBlockNumber] = useState();

  useEffect(() => {
    const launchPeriodSub = (api.query.democracy.launchPeriod() as unknown as Observable<BlockNumber>)
      .pipe(
        take(1)
      )
      .subscribe(launchPeriod => {
        setLaunchPeriod(launchPeriod);
      });
    return () => launchPeriodSub.unsubscribe();
  });

  useEffect(() => {
    // FIXME this is super slow
    const subscription = combineLatest([
      api.query.democracy.publicPropCount() as unknown as Observable<BN>,
      api.query.democracy.referendumCount() as unknown as Observable<BN>,
      api.derive.chain.bestNumber() as unknown as Observable<BlockNumber>
    ])
    .subscribe(([propCount, refCount, blockNumber]) => {
      setPropCount(propCount);
      setRefCount(refCount);
      setLatestBlockNumber(blockNumber);
    });
    return () => subscription.unsubscribe();
  });

  const navToProposals = () => {
    props.history.push(`/governance/${props.match.params.currentAccount}/proposals`);
  };

  const navToReferenda = () => {
    props.history.push(`/governance/${props.match.params.currentAccount}/referenda`);
  };

  return (
    <Card height='100%'>
      <Menu stackable>
        <Menu.Item onClick={navToProposals}>Proposals ({propCount && propCount.toString()})</Menu.Item>
        <Menu.Item onClick={navToReferenda}>Referenda ({refCount && refCount.toString()})</Menu.Item>

        <Menu.Menu position='right'>
          <Menu.Item>
            <WrapperDiv>
              <Progress
                color='pink'
                label='Launch Period'
                progress='ratio'
                size='small'
                total={launchPeriod && launchPeriod.toString() || 1}
                value={latestBlockNumber && latestBlockNumber.mod(launchPeriod || new BN(1)).addn(1).toString()} />
            </WrapperDiv>
          </Menu.Item>
        </Menu.Menu>
      </Menu>

      <Card.Content>
        <Switch>
          <Route path='/governance/:currentAccount/proposals' component={Proposals} />
          <Route path='/governanace/:currentAccount/referenda' component={Referenda} />
          <Redirect exact from='/governance/:currentAccount' to='/governance/:currentAccount/proposals' />
        </Switch>
      </Card.Content>
    </Card>
  );
}