// Copyright 2018-2020 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Button, Header, Icon, Layout } from '@substrate/ui-components';
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';

import { AccountContext } from '../../../components/context';
import { AccountsOverviewCard } from './OverviewCard';
import { PjsButton } from './PjsButton';

export function AccountsOverview(): React.ReactElement {
  const { accounts } = useContext(AccountContext);

  return (
    <>
      <Layout className='pt4'>
        <Header className='inline-flex mr3'>Your Accounts</Header>
        <Link to='/accounts/add'>
          <Button basic icon labelPosition='right'>
            <Icon name='plus' />
            Add New
          </Button>
        </Link>
        <PjsButton />
      </Layout>
      {[...accounts.values()].map((account) => {
        return (
          <AccountsOverviewCard
            address={account.address}
            name={account.name}
            key={account.address}
          />
        );
      })}
    </>
  );
}
