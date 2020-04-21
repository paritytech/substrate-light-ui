// Copyright 2018-2020 @paritytech/Nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import SUIContainer from 'semantic-ui-react/dist/commonjs/elements/Container';
import styled from 'styled-components';

import { FONT_SIZES } from './constants';
import { polkadotOfficialTheme } from './globalStyle';
import {
  DynamicSizeTextProps,
  NodeSelectorProps,
  StackProps,
  StyledNavLinkProps,
  SubHeaderProps,
} from './StyleProps';

export const ContainerFlex = styled(SUIContainer).attrs({
  className: 'flex items-center',
})`
  display: flex !important;
`;

export const Header = styled.h2.attrs((props) => {
  if (!props.className) {
    // then default tachyon clasees
    return {
      className: 'f3 fw6 ma0 tl',
    };
  }
})``;

// TODO: still used in stateful components
export const DynamicSizeText = styled.p<DynamicSizeTextProps>`
  font-size: ${(props): string => FONT_SIZES[props.fontSize || 'medium']};
  font-weight: ${(props): string => props.fontWeight || 'light'};
  margin: 0 0;
  text-align: center;
`;

export const StyledNavLink = styled.span<StyledNavLinkProps>`
  background: none;
  border: none;
  color: ${(props): string =>
    props.inverted
      ? polkadotOfficialTheme.white
      : polkadotOfficialTheme.hotPink};
  font-size: ${FONT_SIZES.medium};
  font-weight: 300;

  :hover {
    cursor: pointer;
  }
`;

export const StyledLinkButton = styled.button`
  align-items: space-between;
  background: none;
  border: none;
  color: ${(props): string => props.color || polkadotOfficialTheme.lightBlue1};
  display: flex;
  font-size: ${FONT_SIZES.medium};
  font-weight: 300;
  justify-content: space-between;

  :hover {
    cursor: pointer;
  }
`;

export const VoteNayButton = styled.button`
  background-image: linear-gradient(
    107deg,
    ${polkadotOfficialTheme.hotPink},
    ${polkadotOfficialTheme.hotPink}
  );
  border: none;
  border-radius: 8px;
  box-shadow: 0 4px 6px 0 rgba(${polkadotOfficialTheme.black}, 0.3);
  color: ${polkadotOfficialTheme.white};
  fontsize: ${FONT_SIZES.large};
  height: 21px;
  width: 51px;

  :hover {
    cursor: pointer;
  }
`;

export const VoteYayButton = styled.button`
  background-image: linear-gradient(
    107deg,
    ${polkadotOfficialTheme.lightBlue1},
    ${polkadotOfficialTheme.lightBlue2}
  );
  border: none;
  border-radius: 8px;
  box-shadow: 0 4px 6px 0 rgba(${polkadotOfficialTheme.black}, 0.3);
  color: ${polkadotOfficialTheme.white};
  fontsize: ${FONT_SIZES.large};
  height: 21px;
  width: 51px;

  :hover {
    cursor: pointer;
  }
`;

export const Stacked = styled.div<StackProps>`
  align-items: ${(props): string => props.alignItems || ''};
  display: flex;
  flex-direction: column;
  justify-content: ${(props): string => props.justifyContent || 'center'};
`;

export const StackedHorizontal = styled.div<StackProps>`
  align-items: ${(props): string => props.alignItems || 'center'};
  display: flex;
  flex-direction: row;
  justify-content: ${(props): string => props.justifyContent || ''};

  @media (max-width: ${(props): number | string => props.wrapAt || '0'}em) {
    flex-wrap: wrap;
  }
`;

export const SubHeader = styled.h3<SubHeaderProps>`
  color: ${polkadotOfficialTheme.black};
  font-weight: 500;
  font-size: ${FONT_SIZES.medium};
  margin: ${(props): string =>
    props.margin ? '1rem auto 0.3rem auto' : '0 0'};
  text-align: ${(props): string => props.textAlign || 'left'};
`;

export const InlineSubHeader = styled(SubHeader)`
  display: inline;
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
