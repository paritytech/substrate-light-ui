// Copyright 2018-2020 @paritytech/Nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import SUIContainer from 'semantic-ui-react/dist/commonjs/elements/Container';
import styled from 'styled-components';

import { polkadotOfficialTheme } from './globalStyle';
import { NodeSelectorProps } from './StyleProps';

export const ContainerFlex = styled(SUIContainer).attrs({
  className: 'flex items-center',
})`
  display: flex !important;
`;

/* TODO compomnent with actions */
export const FramedBlock = styled.div`
  padding: 2rem;
  position: relative;
  border-style: solid;
  border-width: 1px;
`;
export const BlackBlock = styled.div`
  background-color: ${polkadotOfficialTheme.black};
  color: ${polkadotOfficialTheme.white};
`;
export const NodesBlock = styled.span<NodeSelectorProps>`
  width: ${(props): string => (props.fluid ? '100%' : '')};
  position: relative;
  color: inherit important!;
`;
export const NodeSelector = styled.div<NodeSelectorProps>`
  width: ${(props): string => (props.fluid ? '100%' : '')};
`;
export const NodesConnector = styled.div<NodeSelectorProps>`
  width: ${(props): string => (props.fluid ? '50%' : '100px')};
  transform: translateY(-50%);
  min-width: 2rem;
`;
