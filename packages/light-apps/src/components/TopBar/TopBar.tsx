// Copyright 2018-2020 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Container, Layout, Menu } from '@substrate/ui-components';
import React from 'react';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

import { ChooseProvider } from './ChooseProvider';

const MenuTabs = (): React.ReactElement => {
  const { pathname } = useLocation();
  return (
    <Menu borderless tabs size='large'>
      <Container>
        <Menu.Item
          as={Link}
          to='/accounts'
          active={pathname === '/' || pathname.startsWith('/accounts')}
        >
          Accounts
        </Menu.Item>
        <Menu.Item
          as={Link}
          to='/transfer'
          active={pathname.startsWith('/transfer')}
        >
          Send Funds
        </Menu.Item>
      </Container>
    </Menu>
  );
};

/**
 * Render logo based on the chain.
 *
 * @todo FIXME we can render different logos for differenct chains.
 */
function renderLogo(): React.ReactElement {
  return (
    <Link className='w-50 mr3 h3 flex items-center' to='/'>
      Lichen
    </Link>
  );
}

export function TopBar(): React.ReactElement {
  return (
    <>
      <MenuTabs />
      <Layout className='bg-black-90 white'>
        <Container>
          <Layout className='w-100 justify-between'>
            {renderLogo()}
            <ChooseProvider />
          </Layout>
        </Container>
      </Layout>
    </>
  );
}
