// Copyright 2018-2020 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { BlackBlock, ContainerFlex, Menu } from '@substrate/ui-components';
import React from 'react';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

import { ChooseProvider } from './ChooseProvider';

const MenuTabs = (): React.ReactElement => {
  const { pathname } = useLocation();
  return (
    <Menu borderless tabs size='large'>
      <ContainerFlex className='items-center'>
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
      </ContainerFlex>
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
      <BlackBlock>
        <ContainerFlex className='items-center'>
          {renderLogo()}
          <ChooseProvider />
        </ContainerFlex>
      </BlackBlock>
    </>
  );
}
