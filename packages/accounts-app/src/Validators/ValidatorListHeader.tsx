// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AppContext } from '@substrate/ui-common';
import { AddressSummary, FadedText, FlexItem, Margin, StackedHorizontal, SubHeader, WithSpace } from '@substrate/ui-components';
import { DerivedSessionInfo } from '@polkadot/api-derive/types';
import H from 'history';
import { fromNullable } from 'fp-ts/lib/Option';
import React, { useContext, useEffect, useState } from 'react';
import { take } from 'rxjs/operators';
import Card from 'semantic-ui-react/dist/commonjs/views/Card';
import Loader from 'semantic-ui-react/dist/commonjs/elements/Loader/Loader';
import Progress from 'semantic-ui-react/dist/commonjs/modules/Progress/Progress';

import { ConfirmNominationDialog } from './ConfirmNominationDialog';

interface Props {
  history: H.History;
  nominees: Set<string>;
}

export function ValidatorListHeader (props: Props): React.ReactElement {
  const { history, nominees } = props;
  const { api } = useContext(AppContext);
  const [sessionInfo, setSessionInfo] = useState<DerivedSessionInfo>();

  useEffect(() => {
    // TODO p3: maybe even move this to a Session Context
    const subscription = api.derive.session.info()
      .pipe(take(1))
      .subscribe(setSessionInfo);

    return (): void => subscription.unsubscribe();
  }, []);

  const renderEraProgress = (): React.ReactElement => {
    return (
      <WithSpace>
        <Card height='20rem' width='30%'>
          <Card.Content>
            <SubHeader> New Validator Set: </SubHeader>
            {
              fromNullable(sessionInfo)
                .map(sessionInfo =>
                  <Progress
                    color='pink'
                    key={`${sessionInfo.currentEra.toString()}-${sessionInfo.currentIndex.toString()}`}
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
    );
  };

  const renderSessionProgress = (): React.ReactElement => {
    return (
      <WithSpace>
        <Card height='20rem' width='30%'>
          <Card.Content>
            <SubHeader>Next Reward Payout: </SubHeader>
            {
              fromNullable(sessionInfo)
                .map(sessionInfo =>
                  <Progress
                    color='teal'
                    key={`${sessionInfo.currentEra.toString()}-${sessionInfo.currentIndex.toString()}`}
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
    );
  };

  const renderNomineesList = (): React.ReactElement => {
    const nomineesList = [...nominees];

    return (
      <WithSpace>
        <Card height='20rem' width='30%'>
          <Card.Content>
            <SubHeader>Nominees: {nominees.size}</SubHeader>
            <StackedHorizontal>
              {nomineesList.map(nomineeId => <FlexItem key={nomineeId}><AddressSummary address={nomineeId} noBalance noPlaceholderName size='small' /></FlexItem>)}
            </StackedHorizontal>
            {nomineesList.length ? <ConfirmNominationDialog history={history} nominees={[...nominees]} /> : <FadedText>You have not yet added any Validators to your Nominees list. You can browse Validators to add from the table below.</FadedText>}
          </Card.Content>
        </Card>
      </WithSpace>
    );
  };

  return (
    <StackedHorizontal alignItems='stretch' justifyContent='space-around'>
      {renderEraProgress()}
      <Margin left='tiny' />
      {renderSessionProgress()}
      <Margin left='tiny' />
      {renderNomineesList()}
    </StackedHorizontal>
  );
}
