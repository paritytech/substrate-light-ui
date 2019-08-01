// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AppContext } from '@substrate/ui-common';
import { AddressSummary, FadedText, FlexItem, Margin, StackedHorizontal, SubHeader, WithSpace } from '@substrate/ui-components';
import { DerivedSessionInfo } from '@polkadot/api-derive/types';
import H from 'history';
import { fromNullable } from 'fp-ts/lib/Option';
import React, { useContext, useEffect, useState } from 'react';
import { Observable, Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import Card from 'semantic-ui-react/dist/commonjs/views/Card';
import Loader from 'semantic-ui-react/dist/commonjs/elements/Loader/Loader';
import Progress from 'semantic-ui-react/dist/commonjs/modules/Progress/Progress';

import { ConfirmNominationDialog } from './ConfirmNominationDialog';

interface Props {
  history: H.History;
  nominees: string[];
}

export function ValidatorListHeader (props: Props) {
  const { history, nominees } = props;
  const { api } = useContext(AppContext);
  const [sessionInfo, setSessionInfo] = useState<DerivedSessionInfo>();

  useEffect(() => {
    const subscription: Subscription = (api.derive.session.info() as Observable<DerivedSessionInfo>)
      .pipe(
        take(1)
      )
      .subscribe(setSessionInfo);

    return () => subscription.unsubscribe();
  }, []);

  return (
    <StackedHorizontal alignItems='stretch' justifyContent='space-around'>
      <WithSpace>
        <Card height='20rem'>
          <Card.Content>
            <SubHeader> New Validator Set: </SubHeader>
            {
              fromNullable(sessionInfo)
                .map(sessionInfo =>
                  <Progress
                    color='pink'
                    progress='ratio'
                    size='small'
                    total={sessionInfo.eraLength.toNumber()}
                    value={sessionInfo.eraProgress.toNumber()} />
                )
                .getOrElse(<Loader active inline size='mini' />)
            }
            <FadedText>A New Validator Set is Elected Every Era.</FadedText>
          </Card.Content>
        </Card>
      </WithSpace>
      <Margin left='huge' />
      <WithSpace>
        <Card height='20rem'>
          <Card.Content>
            <SubHeader>Next Reward Payout: </SubHeader>
            {
              fromNullable(sessionInfo)
                .map(sessionInfo =>
                  <Progress
                    color='teal'
                    progress='ratio'
                    size='small'
                    total={sessionInfo.sessionLength.toNumber()}
                    value={sessionInfo.sessionProgress.toNumber()} />
                )
                .getOrElse(<Loader active inline size='mini' />)
            }
            <FadedText>Validator Pool Block Rewards are Paid Out Every Session. </FadedText>
          </Card.Content>
        </Card>
      </WithSpace>
      <Margin left='huge' />
      <WithSpace>
        <Card height='20rem'>
          <Card.Content>
            <SubHeader>Nominees: {nominees.length}</SubHeader>
            <StackedHorizontal>
            {
                nominees.map(nomineeId => <FlexItem><AddressSummary address={nomineeId} noBalance noPlaceholderName size='small' /></FlexItem>)
            }
            </StackedHorizontal>
            <ConfirmNominationDialog history={history} nominees={nominees} />
          </Card.Content>
        </Card>
      </WithSpace>
    </StackedHorizontal>
  );
}
