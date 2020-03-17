import { Dropdown, DropdownProps } from '@substrate/ui-components';
import React, { useContext } from 'react';
import styled from 'styled-components';

import {
  DEFAULT_PROVIDER,
  LazyProvider,
  ProviderContext,
} from '../../ContextGate/context';

const allProviders: Record<string, LazyProvider> = {
  [DEFAULT_PROVIDER.id]: DEFAULT_PROVIDER,
};

const TopDropdown = styled(Dropdown)`
  z-index: 1000;
`;

export function ChooseProvider(): React.ReactElement {
  const { lazy, setLazyProvider } = useContext(ProviderContext);

  return (
    <TopDropdown
      onChange={(
        _event: React.SyntheticEvent,
        { value }: DropdownProps
      ): void => {
        setLazyProvider(allProviders[value as string]);
      }}
      options={Object.values(allProviders).map(
        ({ description, id, network }) => ({
          key: id,
          text: `${network} (${description})`,
          value: id,
        })
      )}
      placeholder='Select Network'
      value={lazy?.id}
    />
  );
}
