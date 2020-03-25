// Copyright 2018-2020 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Stacked, StyledLinkButton } from '@substrate/ui-components';
import React, { useContext } from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';

import { KeyringContext } from '../ContextGate/context';
import { AccountsOverviewCard } from './OverviewCard';

type Props = RouteComponentProps;

export function AccountsOverview(props: Props): React.ReactElement {
  const { history } = props;
  const { accounts } = useContext(KeyringContext);

  return (
    <Stacked>
      {Object.values(accounts).map((account) => {
        return (
          <AccountsOverviewCard
            address={account.json.address}
            name={account.json.meta.name}
            history={history}
            key={account.json.address}
          />
        );
      })}
      <Link to='/accounts/add'>
        <StyledLinkButton>Add Account</StyledLinkButton>
      </Link>
    </Stacked>
  );
}
