// Copyright 2018-2020 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import Injected from '@polkadot/extension-base/page/Injected';
import { ProviderMeta } from '@polkadot/extension-inject/types';
import { ProviderInterface } from '@polkadot/rpc-provider/types';
import { logger } from '@polkadot/util';
import { Dropdown, DropdownProps } from '@substrate/ui-components';
import React, { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';

import {
  DEFAULT_PROVIDER,
  ExtensionContext,
  LazyProvider,
  ProviderContext,
} from '../../ContextGate/context';

const l = logger('choose-provider');

const TopDropdown = styled(Dropdown)`
  z-index: 1000;
`;

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

export function ChooseProvider(): React.ReactElement {
  const { lazy, setLazyProvider } = useContext(ProviderContext);
  const { injected } = useContext(ExtensionContext);

  const [allProviders, setAllProviders] = useState<
    Record<string, LazyProvider>
  >({ [DEFAULT_PROVIDER.id]: DEFAULT_PROVIDER });

  useEffect(() => {
    if (!injected) {
      return;
    }

    injected.provider
      .listProviders()
      .then((providers) => {
        return {
          [DEFAULT_PROVIDER.id]: DEFAULT_PROVIDER,
          ...Object.entries(providers).reduce((acc, [key, value]) => {
            const lazyProvider = toLazyProvider(injected, value, key);
            acc[lazyProvider.id] = lazyProvider;

            return acc;
          }, {} as Record<string, LazyProvider>),
        };
      })
      .then(setAllProviders)
      .catch(l.error);
  }, [injected]);

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
