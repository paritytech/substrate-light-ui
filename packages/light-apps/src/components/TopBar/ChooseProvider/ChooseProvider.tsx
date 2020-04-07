// Copyright 2018-2020 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ProviderMeta } from '@polkadot/extension-inject/types';
import { ProviderInterface } from '@polkadot/rpc-provider/types';
import { logger } from '@polkadot/util';
import {
  ConnectedNodes,
  Dropdown,
  DropdownProps,
} from '@substrate/ui-components';
import React, { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';

import { Injected, InjectedContext, ProviderContext } from '../../context';
import { FALLBACK_PROVIDERS, LazyProvider } from './discover';

const l = logger('choose-provider');

// To keep it above the loading dimmer
const TopDropdown = styled(Dropdown)`
  z-index: 1000;
`;

const GREEN = '#79c879';
const RED = '#ff0000';

/**
 * The fallback providers are the ones which connect to a centralized remote
 * node.
 */
const fallbackProviders = FALLBACK_PROVIDERS.reduce((acc, provider) => {
  acc[provider.id] = provider;

  return acc;
}, {} as Record<string, LazyProvider>);

/**
 * Convert a ProviderMeta from the extension to a LazyProvider used by our
 * ProviderContext.
 */
function toLazyProvider(
  injected: Injected,
  meta: ProviderMeta,
  key: string
): LazyProvider {
  return {
    ...meta,
    description: `${meta.node} node from from ${meta.source} extension`,
    id: `${meta.network}-PostMessageProvider`,
    async start(): Promise<ProviderInterface> {
      await injected.provider.startProvider(key);

      return injected.provider;
    },
  };
}

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
 * From all the providers we have, derive all the networks.
 */
function getAllNetworks(
  allProviders: Record<string, LazyProvider>
): { network: string }[] {
  return [
    ...new Set(
      Object.values(allProviders).map(({ network }) => ({
        network,
      }))
    ),
  ];
}

/**
 * Filter out the providers for one particular chain.
 */
function getAllProvidersForNetwork(
  forNetwork: string,
  allProviders: Record<string, LazyProvider>
): LazyProvider[] {
  return Object.values(allProviders).filter(
    ({ network }) => network === forNetwork
  );
}

export function ChooseProvider(): React.ReactElement {
  const { lazy, setLazyProvider } = useContext(ProviderContext);
  const { injected } = useContext(InjectedContext);

  const [allProviders, setAllProviders] = useState(fallbackProviders);
  const [network, setNetwork] = useState<string>();

  const allNetworks = getAllNetworks(allProviders);
  const allProvidersForNetwork = network
    ? getAllProvidersForNetwork(network, allProviders)
    : [];

  useEffect(() => {
    if (!injected) {
      return;
    }

    injected.provider
      .listProviders()
      .then((providers) => {
        return {
          ...Object.entries(providers).reduce((acc, [key, value]) => {
            const lazyProvider = toLazyProvider(injected, value, key);
            acc[lazyProvider.id] = lazyProvider;

            return acc;
          }, {} as Record<string, LazyProvider>),
          ...fallbackProviders,
        };
      })
      .then(setAllProviders)
      .catch(l.error);
  }, [injected]);

  return (
    <ConnectedNodes>
      <TopDropdown
        onChange={(
          _event: React.SyntheticEvent,
          { value }: DropdownProps
        ): void => {
          setNetwork(value as string);
        }}
        options={allNetworks.map(({ network }) => ({
          key: network,
          text: network,
          value: network,
        }))}
        placeholder='Select Network'
        value={network}
      />

      <TopDropdown
        onChange={(
          _event: React.SyntheticEvent,
          { value }: DropdownProps
        ): void => {
          setLazyProvider(allProviders[value as string]);
        }}
        options={allProvidersForNetwork.map((lazy) => ({
          key: lazy.id,
          text: `${lazy.description}`,
          value: lazy.id,
        }))}
        placeholder='Select Network'
        value={lazy?.id}
      />
    </ConnectedNodes>
  );
}
