// Copyright 2018-2020 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { logger } from '@polkadot/util';
import {
  ConnectedNodes,
  Dropdown,
  DropdownProps,
} from '@substrate/ui-components';
import React, { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';

import { InjectedContext, ProviderContext } from '../../context';
import {
  discoverChain,
  getAllProviders,
  getAllProvidersForChain,
  LazyProvider,
} from './discover';

const l = logger('choose-provider');

// To keep it above the loading dimmer
const TopDropdown = styled(Dropdown)`
  z-index: 1000;
`;

const GREEN = '#79c879';
const RED = '#ff0000';

// function renderHealth(
//   chain?: Text,
//   header?: Header,
//   health?: Health
// ): React.ReactElement {
//   if (!header || !health) {
//     return <div />;
//   }

//   return (
//     <div className='flex items-center justify-between truncate'>
//       {health.isSyncing.isTrue ? (
//         <Circle fill={GREEN} radius={10} />
//       ) : (
//         <Circle fill={RED} radius={10} />
//       )}
//       <Margin left='small' />
//       <span className='mh1 truncate'>
//         {chain ? `${chain.toString().toUpperCase()}` : ''}
//       </span>
//       <span className='db-l dn f7 silver truncate'>
//         Block #{header.number.toString()}
//       </span>
//     </div>
//   );
// }

/**
 * From all the providers we have, derive all the chains.
 */
function getAllChain(allProviders: Record<string, LazyProvider>): string[] {
  return [
    ...new Set(Object.values(allProviders).map(({ network }) => network)),
  ];
}

export function ChooseProvider(): React.ReactElement {
  const { lazy, setLazyProvider } = useContext(ProviderContext);
  const { injected } = useContext(InjectedContext);

  const [allProviders, setAllProviders] = useState<
    Record<string, LazyProvider>
  >({});
  const [chain, setChain] = useState<string>();

  const allChains = getAllChain(allProviders);
  const allProvidersForChain = chain
    ? getAllProvidersForChain(chain, allProviders)
    : [];

  // Get the list of all available providers
  useEffect(() => {
    getAllProviders({ injected }).then(setAllProviders).catch(l.error);
  }, [injected]);

  // Once we get the list of chains, select one
  useEffect(() => {
    // If we already chose a chain, skip
    if (chain || !allChains.length) {
      return;
    }

    // Choose westend by default (it works the best with light client
    // currently).
    if (allChains.includes('westend')) {
      return setChain('westend');
    }
    // Or else choose kusama
    if (allChains.includes('westend')) {
      return setChain('westend');
    }
    // Or else just choose the first one
    setChain(allChains[0]);
  }, [chain, allChains]);

  // Discover best provider when we switch chain
  useEffect(() => {
    if (!chain || !Object.keys(allProviders).length) {
      return;
    }

    const bestProvider = discoverChain(chain, allProviders);

    if (!bestProvider) {
      return l.error(`Cannot find provider for chain ${chain}`);
    }

    setLazyProvider(bestProvider);
  }, [allProviders, chain, setLazyProvider]);

  return (
    <ConnectedNodes>
      <TopDropdown
        onChange={(
          _event: React.SyntheticEvent,
          { value }: DropdownProps
        ): void => {
          setChain(value as string);
        }}
        options={allChains.map((chain) => ({
          key: chain,
          text: chain,
          value: chain,
        }))}
        placeholder='Loading chains...'
        value={chain}
      />

      <TopDropdown
        disabled={!chain}
        onChange={(
          _event: React.SyntheticEvent,
          { value }: DropdownProps
        ): void => {
          setLazyProvider(allProviders[value as string]);
        }}
        options={allProvidersForChain.map((lazy) => ({
          key: lazy.id,
          text: `${lazy.description}`,
          value: lazy.id,
        }))}
        placeholder='Discovering providers...'
        value={lazy?.id}
      />
    </ConnectedNodes>
  );
}
