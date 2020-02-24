// Copyright 2018-2020 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Text } from '@polkadot/types';
import { Header, Health } from '@polkadot/types/interfaces';
import substrateLogo from '@polkadot/ui-assets/polkadot-circle.svg';
import { SystemContext } from '@substrate/context';
import {
  Circle,
  Container,
  Margin,
  StackedHorizontal,
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
function renderLogo(chain?: Text): React.ReactElement {
  return (
    <StackedHorizontal>
      <Link to='/'>
        <img alt='Polkadot Logo' src={substrateLogo} width={50} />
      </Link>
      <p>Lichen{chain ? ` on ${chain.toString()}` : ''}</p>
    </StackedHorizontal>
  );
}

function renderHealth(header?: Header, health?: Health): React.ReactElement {
  if (!header || !health) {
    return <div />;
  }

  return (
    <div>
      <StackedHorizontal>
        {health.isSyncing.isTrue ? (
          <Circle fill={GREEN} radius={10} />
        ) : (
          <Circle fill={RED} radius={10} />
        )}
        <Margin left='small' />
        <p>Status: {health.isSyncing.isTrue ? 'Syncing' : 'Synced'}</p>
      </StackedHorizontal>
      <p>Block #{header.number.toString()}</p>
    </div>
  );
}

export function TopBar(): React.ReactElement {
  const { chain, header, health } = useContext(SystemContext);

  return (
    <Container as='header'>
      <StackedHorizontal justifyContent='space-between' alignItems='center'>
        {renderLogo(chain)}
        {renderHealth(header, health)}
        <ChooseProvider />
      </StackedHorizontal>
    </Container>
  );
}
