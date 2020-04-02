// Copyright 2018-2020 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Stacked, StyledLinkButton } from '@substrate/ui-components';
import React, { useContext } from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';

import { AccountContext } from '../../ContextGate/context';
import { AccountsOverviewCard } from './OverviewCard';

type Props = RouteComponentProps;

export function AccountsOverview(): React.ReactElement {
  const { accounts } = useContext(AccountContext);

  return (
    <Stacked>
      {[...accounts.values()].map((account) => {
        return (
          <AccountsOverviewCard
            address={account.address}
            name={account.name}
            key={account.address}
          />
        );
      })}
      <Link to='/accounts/add'>
        <StyledLinkButton>Add Account</StyledLinkButton>
      </Link>
    </Stacked>
  );
}
