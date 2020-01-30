// Copyright 2018-2020 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Compact } from '@polkadot/types';
import { BlockNumber, Header } from '@polkadot/types/interfaces';
import substrateLogo from '@polkadot/ui-assets/polkadot-circle.svg';
import { ApiContext, HealthContext } from '@substrate/context';
import { Circle, FadedText, Loading, Margin, Stacked, StackedHorizontal, SubHeader } from '@substrate/ui-components';
import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const GREEN = '#79c879';
const RED = '#ff0000';

export function renderBlockCounter(blockNumber?: Compact<BlockNumber>, chainName?: string): React.ReactElement {
  return (
    <>
      <SubHeader noMargin>{chainName ? chainName.toString() : <Loading active />}</SubHeader>
      <div>Block #: {blockNumber ? blockNumber.toString() : <Loading active />}</div>
    </>
  );
}

export function renderNodeStatus(isSyncing: boolean): React.ReactElement {
  return (
    <StackedHorizontal>
      {isSyncing ? <Circle fill={GREEN} radius={10} /> : <Circle fill={RED} radius={10} />}
      <Margin left='small' />
      <p>Status: {isSyncing ? 'Syncing' : 'Synced'}</p>
    </StackedHorizontal>
  );
}

export function TopBar(): React.ReactElement {
  const { api, system } = useContext(ApiContext);
  const { isSyncing } = useContext(HealthContext);
  const [header, setHeader] = useState<Header>();

  useEffect(() => {
    const sub = api.rpc.chain.subscribeNewHeads().subscribe(setHeader);

    return (): void => sub.unsubscribe();
  }, [api]);

  return (
    <header>
      <StackedHorizontal justifyContent='space-between' alignItems='center'>
        <Link to='/'>
          <img alt='Polkadot Logo' src={substrateLogo} width={50} />
        </Link>
        {system && (
          <FadedText>
            {system.name} {system.version}
          </FadedText>
        )}
        <Stacked>
          {renderNodeStatus(isSyncing)}
          {renderBlockCounter(header?.number, system?.chain)}
        </Stacked>
      </StackedHorizontal>
      <Margin bottom />
    </header>
  );
}
