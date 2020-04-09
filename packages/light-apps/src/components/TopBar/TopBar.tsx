// Copyright 2018-2020 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { BlackBlock, Container } from '@substrate/ui-components';
import React from 'react';
import { Link } from 'react-router-dom';

import { ChooseProvider } from './ChooseProvider';

/**
 * Render logo based on the chain.
 *
 * @todo FIXME we can render different logos for differenct chains.
 */
function renderLogo(): React.ReactElement {
  return (
    <Link className='w-60' to='/'>
      Lichen
    </Link>
  );
}

export function TopBar(): React.ReactElement {
  return (
    <>
      <div className='flex'>
        <BlackBlock className='w-10'>
          <Link to='/accounts'>Accounts</Link>
        </BlackBlock>
        <BlackBlock className='w-10'>
          <Link to='/transfer'>Transfer</Link>
        </BlackBlock>
      </div>
      <BlackBlock>
        <Container as='header'>
          <div className='flex items-center'>
            {renderLogo()}
            <ChooseProvider />
          </div>
        </Container>
      </BlackBlock>
    </>
  );
}
