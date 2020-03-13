import { Dropdown, DropdownProps } from '@substrate/ui-components';
import React, { useContext } from 'react';
import styled from 'styled-components';

import { ProviderContext } from '../../ContextGate/context';

const options = [
  {
    key: 'PostMessageProvider|kusamaCc3',
    text: 'Kusama CC3 (from extension Light Client)',
    value: JSON.stringify({
      payload: 'kusamaCc3',
      type: 'PostMessageProvider',
    }),
  },
  {
    key: 'PostMessageProvider|westend',
    text: 'Westend (from extension Light Client)',
    value: JSON.stringify({
      payload: 'westend',
      type: 'PostMessageProvider',
    }),
  },
  {
    key: 'WsProvider|kusamaCc3',
    text: 'Kusama CC3 (from centralized remote node)',
    value: JSON.stringify({
      payload: 'wss://kusama-rpc.polkadot.io',
      type: 'WsProvider',
    }),
  },
];

const TopDropdown = styled(Dropdown)`
  &&& {
    z-index: 1000;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  &&& > .text {
    max-width: 30vw;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  &&& .menu {
    width: calc(100% + 2rem + 4px);
    left: calc(-1rem - 2px);
    border: 1px solid #1e1e1e;
    top: calc(100% + 0.5rem + 1px);
    background: #1e1e1e;
    .item {
      color: white;
      transition: background-color 0.1s;
      &:hover {
        background-color: #333333;
      }
    }
  }
`;

export function ChooseProvider(): React.ReactElement {
  const { providerJSON, setProviderJSON } = useContext(ProviderContext);

  return (
    <TopDropdown
      onChange={(
        _event: React.SyntheticEvent,
        { value }: DropdownProps
      ): void => {
        console.log(value);
        setProviderJSON(JSON.parse(value as string));
      }}
      options={options}
      placeholder='Select Network'
      value={JSON.stringify(providerJSON)}
      fluid
    />
  );
}
