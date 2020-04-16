// Copyright 2018-2020 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import {
  Button,
  Icon,
  Stacked,
  StackedHorizontal,
} from '@substrate/ui-components';
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';

import { AccountContext } from '../../../components/context';
import { AccountsOverviewCard } from './OverviewCard';

export function AccountsOverview(): React.ReactElement {
  const { accounts } = useContext(AccountContext);

  return (
    <Stacked>
      <StackedHorizontal>
        <h2 className='inline-flex mr3 mb0'>Your Accounts</h2>
        <Link to='/accounts/add'>
          <Button basic icon labelPosition='right'>
            <Icon name='plus' />
            Add New
          </Button>
        </Link>
      </StackedHorizontal>
      {[...accounts.values()].map((account) => {
        return (
          <AccountsOverviewCard
            address={account.address}
            name={account.name}
            key={account.address}
          />
        );
      })}
    </Stacked>
  );
}
