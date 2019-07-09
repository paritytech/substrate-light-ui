// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DerivedStaking } from '@polkadot/api-derive/types';
import { AccountId, Balance, Exposure } from '@polkadot/types';
import { formatBalance } from '@polkadot/util';
import { AppContext } from '@substrate/ui-common';
import { Address, AddressSummary, Grid, Loading, Menu, StyledLinkButton, SubHeader, WithSpace, WithSpaceAround } from '@substrate/ui-components';
import { fromNullable } from 'fp-ts/lib/Option';
import React, { useEffect, useState, useContext } from 'react';
import { Observable, Subscription } from 'rxjs';
import Modal from 'semantic-ui-react/dist/commonjs/modules/Modal/Modal';

import { StakingOptions } from './StakingOptions';
import { BalanceOverview } from './BalanceOverview';

interface Props {
  address: string;
  name: string;
  handleForget: () => void;
  handleBackup: () => void;
}

interface State {
  controllerId?: string;
  isStashNominating?: boolean;
  isStashValidating?: boolean;
  nominators?: any;
  sessionId?: string;
  stashActive?: any;
  stakers?: Exposure;
  stashId?: string;
  stashTotal: string;
}

export function AccountsOverviewDetailed (props: Props) {
  const { address, name } = props;
  const { api } = useContext(AppContext);
  const [state, setState] = useState<State>();
  const [page, setPage] = useState('balancesOverview');

  useEffect(() => {
    let subscription: Subscription =
        (api.derive.staking.info(address) as Observable<DerivedStaking>)
          .subscribe((stakingInfo: DerivedStaking) => {
            if (!stakingInfo) {
              return;
            }

            const { controllerId, nextSessionId, nominators, stakers, stashId, stakingLedger, validatorPrefs } = stakingInfo;

            const isStashNominating = nominators && nominators.length !== 0;
            const isStashValidating = !!validatorPrefs && !validatorPrefs.isEmpty && !isStashNominating;

            const state = {
              controllerId: controllerId && controllerId.toString(),
              isStashNominating,
              isStashValidating,
              nominators,
              // rewardDestination: rewardDestination && rewardDestination.toNumber(), FIXME update api to ^.81.0 first
              sessionId: nextSessionId && nextSessionId.toString(),
              stashActive: stakingLedger ? formatBalance(stakingLedger.active) : formatBalance(new Balance(0)),
              stakers,
              stashId: stashId && stashId.toString(),
              stashTotal: stakingLedger ? formatBalance(stakingLedger.total) : formatBalance(new Balance(0))
            };

            setState(state);
          });
    return () => subscription.unsubscribe();
  }, [api]);

  const renderDetails = () => {
    return (
      <React.Fragment>
        {
          fromNullable(state)
            .mapNullable(({ controllerId, stashId, stakers, stashActive, stashTotal }) => ({ address, controllerId, stashId, stakers, stashActive, stashTotal }))
            .map((props) => <BalanceOverview address={address} {...props} />)
            .getOrElse(<Loading active />)
        }
        {renderNominationDetails()}
      </React.Fragment>
    );
  };

  const renderNominationDetails = () => {
    return (
      <Grid.Column width='5'>
        <WithSpace>
          <Grid.Row>
            <SubHeader noMargin>Currently Nominating:</SubHeader>
              {
                state!.nominators
                  ? state!.nominators
                      .map((address: AccountId) => {
                        return <AddressSummary
                          address={address.toString()}
                          key={address.toString()}
                          orientation='horizontal'
                          size='small'
                        />;
                      })
                  : <div>Nobody</div>
              }
          </Grid.Row>
        </WithSpace>
        <WithSpace>
          <Grid.Row>
            <SubHeader> Reward Destination: </SubHeader>
          </Grid.Row>
        </WithSpace >
      </Grid.Column>
    );
  };

  const renderGeneral = () => {
    return (
      <React.Fragment>
        <Grid.Column stretched width='6'>
          <AddressSummary address={address} detailed isNominator={state && state.isStashNominating} isValidator={state && state.isStashValidating} name={name} size='medium' />
        </Grid.Column>
        {
          page === 'stakingOptions'
            ? renderStakingOptions()
            : renderDetails()
        }
      </React.Fragment>
    );
  };

  const renderStakingOptions = () => {
    return <StakingOptions />
  }
  
  const toggleScreen = () => {
    page === 'stakingOptions'
      ? setPage('balancesOverview')
      : setPage('stakingOptions');
  }

  return (
    <Modal trigger={<StyledLinkButton>Show More</StyledLinkButton>}>
      <Menu>
        <Menu.Menu position='left'><Address address={address} /></Menu.Menu>
        <Menu.Menu position='right'>
          <Menu.Item onClick={toggleScreen}>{page === 'stakingOptions' ? 'Balances Overview' : 'Staking Options'}</Menu.Item>
        </Menu.Menu>
      </Menu>
      <WithSpaceAround>
        <Grid columns='16'>
          {
            fromNullable(state)
              .map(() => renderGeneral())
              .getOrElse(<Loading active inline inverted />)
          }
        </Grid>
      </WithSpaceAround>
    </Modal>
  );
}
