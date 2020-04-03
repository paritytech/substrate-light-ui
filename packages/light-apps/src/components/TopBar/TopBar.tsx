// Copyright 2018-2020 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Text } from '@polkadot/types';
import { Header, Health } from '@polkadot/types/interfaces';
import { SystemContext } from '@substrate/context';
import {
  BlackBlock,
  Circle,
  ConnectedNodes,
  Container,
  Margin,
} from '@substrate/ui-components';
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';

import { ChooseProvider } from './ChooseProvider';

const GREEN = '#79c879';
const RED = '#ff0000';

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

function renderHealth(
  chain?: Text,
  header?: Header,
  health?: Health
): React.ReactElement {
  if (!header || !health) {
    return <div />;
  }

  return (
    <div className='flex items-center justify-between truncate'>
      {health.isSyncing.isTrue ? (
        <Circle fill={GREEN} radius={10} />
      ) : (
        <Circle fill={RED} radius={10} />
      )}
      <Margin left='small' />
      <span className='mh1 truncate'>
        {chain ? `${chain.toString().toUpperCase()}` : ''}
      </span>
      <span className='db-l dn f7 silver truncate'>
        Block #{header.number.toString()}
      </span>
    </div>
  );
}

export function TopBar(): React.ReactElement {
  const { chain, header, health } = useContext(SystemContext);

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
            <ConnectedNodes fluid>
              {renderHealth(chain, header, health)}
              <ChooseProvider />
            </ConnectedNodes>
          </div>
        </Container>
      </BlackBlock>
    </>
  );
}
