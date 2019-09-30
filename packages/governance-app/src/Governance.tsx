// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { BlockNumber, PropIndex, ReferendumIndex } from '@polkadot/types/interfaces';
import { AppContext } from '@substrate/ui-common';
import { FadedText, Menu, Stacked, WrapperDiv } from '@substrate/ui-components';
import BN from 'bn.js';
import React, { useEffect, useContext, useState } from 'react';
import { Redirect, Route, RouteComponentProps, Switch } from 'react-router-dom';
import { combineLatest } from 'rxjs';
import { take } from 'rxjs/operators';
import Card from 'semantic-ui-react/dist/commonjs/views/Card';
import Progress from 'semantic-ui-react/dist/commonjs/modules/Progress/Progress';

import { Council } from './Council';
import { Democracy } from './Democracy';

interface MatchParams {
  currentAccount: string;
}

interface IProps extends RouteComponentProps<MatchParams> { }

export function Governance (props: IProps) {
  const { api } = useContext(AppContext);
  const [refCount, setRefCount] = useState();
  const [latestBlockNumber, setLatestBlockNumber] = useState();
  const [councilMotionsCount, setCouncilMotionsCount] = useState();

  const launchPeriod = api.consts.democracy.launchPeriod as BlockNumber;

  useEffect(() => {
    const blockSub = api.derive.chain.bestNumber().subscribe(setLatestBlockNumber);

    return () => blockSub.unsubscribe();
  }, []);

  useEffect(() => {
    const subscription = combineLatest([
      api.query.democracy.publicPropCount<PropIndex>(),
      api.query.democracy.referendumCount<ReferendumIndex>()
    ]).pipe(take(1))
      .subscribe(([motionsCount, refCount]) => {
        setCouncilMotionsCount(motionsCount);
        setRefCount(refCount);
      });

    return () => subscription.unsubscribe();
  }, []);

  const navToDemocracy = () => {
    let { history, location, match } = props;
    let currentPath = location.pathname.split('/')[3];
    if (currentPath !== 'democracy') {
      history.push(`/governance/${match.params.currentAccount}/democracy`);
    }
  };

  const navToCouncil = () => {
    let { history, location, match } = props;
    let currentPath = location.pathname.split('/')[3];
    if (currentPath !== 'council') {
      history.push(`/governance/${match.params.currentAccount}/council`);
    }
  };

  return (
    <Card height='100%' fluid>
      <Menu stackable>
        <Menu.Item onClick={navToDemocracy}>
          Democracy
          <Stacked justifyContent='flex-end' alignItems='center'>
            <FadedText>Proposals ()</FadedText>
            <FadedText>Referenda ({refCount && refCount.toString()})</FadedText>
          </Stacked>
        </Menu.Item>
        <Menu.Item onClick={navToCouncil}>
          <Stacked justifyContent='flex-end'>
            Council
            <FadedText>Motions ({councilMotionsCount && councilMotionsCount.toString()})</FadedText>
          </Stacked>
        </Menu.Item>
        <Menu.Item>Delegations</Menu.Item>

        <Menu.Menu position='right'>
          <Menu.Item>
            <WrapperDiv>
              <Progress
                color='pink'
                label='Launch Period'
                progress='ratio'
                size='small'
                total={launchPeriod ? launchPeriod.toString() : 1}
                value={latestBlockNumber && latestBlockNumber.mod(launchPeriod || new BN(1)).addn(1).toString()} />
            </WrapperDiv>
          </Menu.Item>
        </Menu.Menu>
      </Menu>

      <Card.Content>
        <Switch>
          <Route path='/governance/:currentAccount/democracy' component={Democracy} />
          <Route path='/governance/:currentAccount/council' component={Council} />
          <Redirect exact from='/governance/:currentAccount' to='/governance/:currentAccount/democracy' />
        </Switch>
      </Card.Content>
    </Card>
  );
}
