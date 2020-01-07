// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import substrateLogo from '@polkadot/ui-assets/polkadot-circle.svg';
import { ApiContext } from '@substrate/context';
import { FadedText, Margin, Stacked, StackedHorizontal } from '@substrate/ui-components';
import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { BlockCounter, NodeStatus } from './TopBar.styles';

export function TopBar(): React.ReactElement {
  const {
    api,
    system: {
      chain,
      health: { isSyncing },
      name,
      version,
    },
  } = useContext(ApiContext);

  const [blockNumber, setBlockNumber] = useState();
  useEffect(() => {
    const chainHeadSub = api.rpc.chain.subscribeNewHeads().subscribe(header => setBlockNumber(header.number));

    return (): void => {
      chainHeadSub.unsubscribe();
    };
  }, [api, setBlockNumber]);

  return (
    <header>
      <StackedHorizontal justifyContent='space-between' alignItems='center'>
        <Link to='/'>
          <img alt='Polkadot Logo' src={substrateLogo} width={50} />
        </Link>
        <FadedText>
          {name} {version}
        </FadedText>
        <Stacked>
          <NodeStatus isSyncing={isSyncing} />
          <BlockCounter blockNumber={blockNumber} chainName={chain} />
        </Stacked>
      </StackedHorizontal>
      <Margin bottom />
    </header>
  );
}
