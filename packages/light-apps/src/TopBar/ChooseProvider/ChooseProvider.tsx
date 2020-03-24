import { web3UseRpcProvider } from '@polkadot/extension-dapp';
import { ProviderMeta } from '@polkadot/extension-inject/types';
import { ProviderInterface } from '@polkadot/rpc-provider/types';
import { Dropdown, DropdownProps } from '@substrate/ui-components';
import React, { useContext } from 'react';
import styled from 'styled-components';

import {
  DEFAULT_PROVIDER,
  ExtensionContext,
  LazyProvider,
  ProviderContext,
} from '../../ContextGate/context';

const TopDropdown = styled(Dropdown)`
  z-index: 1000;
`;

/**
 * Convert a ProviderMeta from the extension to a LazyProvider used by our
 * ProviderContext.
 */
function toLazyProvider(meta: ProviderMeta, key: string): LazyProvider {
  return {
    ...meta,
    description: `${meta.node} node from from ${meta.source} extension`,
    id: `${meta.network}-PostMessageProvider`,
    async start(): Promise<ProviderInterface> {
      const { provider } = await web3UseRpcProvider('slui', key);

      return provider;
    },
  };
}

export function ChooseProvider(): React.ReactElement {
  const { lazy, setLazyProvider } = useContext(ProviderContext);
  const { providers } = useContext(ExtensionContext);

  const allProviders: Record<string, LazyProvider> = {
    [DEFAULT_PROVIDER.id]: DEFAULT_PROVIDER,
    ...Object.entries(providers).reduce((acc, [key, value]) => {
      const lazyProvider = toLazyProvider(value, key);
      acc[lazyProvider.id] = lazyProvider;

      return acc;
    }, {} as Record<string, LazyProvider>),
  };

  return (
    <TopDropdown
      onChange={(
        _event: React.SyntheticEvent,
        { value }: DropdownProps
      ): void => {
        setLazyProvider(allProviders[value as string]);
      }}
      options={Object.values(allProviders).map((lazy) => ({
        key: lazy.id,
        text: `${lazy.network} (${lazy.description})`,
        value: lazy.id,
      }))}
      placeholder='Select Network'
      value={lazy?.id}
    />
  );
}
