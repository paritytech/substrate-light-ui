// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AppContext } from '@substrate/ui-common';
import { FadedText, FlexItem, NavLink, StackedHorizontal, Margin } from '@substrate/ui-components';
import React, { useContext, useEffect, useState } from 'react';

import { BlockCounter, NodeStatus } from './TopBar.styles';
import substrateLogo from '@polkadot/ui-assets/polkadot-circle.svg';

interface Props { }

export function TopBar (props: Props) {
  const { api, system: { chain, health: { isSyncing }, name, version } } = useContext(AppContext);

  const [blockNumber, setBlockNumber] = useState();
  useEffect(() => {
    const chainHeadSub = api.rpc.chain.subscribeNewHeads().subscribe((header) => setBlockNumber(header.number));

    return () => {
      chainHeadSub.unsubscribe();
    };
  }, [api, setBlockNumber]);

  return (
    <header>
      <Margin top='big' />
      <StackedHorizontal justifyContent='space-between' alignItems='flex-end'>
        <FlexItem>
          <NodeStatus isSyncing={isSyncing} />
        </FlexItem>
        <FlexItem>
          <NavLink to='/'> <img alt='Parity Substrate Logo' src={substrateLogo} width={50} /> </NavLink>
          <FadedText> {name} {version} </FadedText>
        </FlexItem>
        <FlexItem>
          <BlockCounter blockNumber={blockNumber} chainName={chain} />
        </FlexItem>
      </StackedHorizontal>
    </header>
  );
}
