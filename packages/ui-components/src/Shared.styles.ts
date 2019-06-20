// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Link } from 'react-router-dom';
import styled from 'styled-components';
import SUIContainer from 'semantic-ui-react/dist/commonjs/elements/Container';
import SUIDropdown from 'semantic-ui-react/dist/commonjs/modules/Dropdown';
import SUIInput from 'semantic-ui-react/dist/commonjs/elements/Input';

import { FONT_SIZES, MARGIN_SIZES } from './constants';
import { DynamicSizeTextProps, HeaderProps, FlexItemProps, StackProps, StyledNavLinkProps, SubHeaderProps, WithSpaceAroundProps, WithSpaceBetweenProps, WrapperDivProps } from './StyleProps';

// FIXME: customize as needed
export const Dropdown = styled<any>(SUIDropdown)`
  color: ${props => props.theme.black};
`;

export const Input = styled<any>(SUIInput)`
  width: ${props => props.width || '100%'}
`;

export const Container = styled(SUIContainer)`
  padding: ${MARGIN_SIZES.large};
`;

export const FadedText = styled.p`
  color: ${props => props.theme.black};
  opacity: 0.5;
  text-align: center;
`;

export const FlexItem = styled.div<FlexItemProps>`
  flex: ${props => props.flex || 1};
`;

export const ErrorText = styled.p`
  color: red;
  text-align: center;
  font-weight: 500;
`;

export const SuccessText = styled.p`
  color: green;
  text-align: center;
  font-weight: 500;
`;

export const WithSpace = styled.div`
  margin: ${MARGIN_SIZES.medium} auto;
`;

export const WithSpaceAround = styled.div<WithSpaceAroundProps>`
  margin: ${props => MARGIN_SIZES[props.margin || 'medium']};
  padding: ${props => MARGIN_SIZES[props.padding || 'medium']};
`;

export const WithSpaceBetween = styled.div<WithSpaceBetweenProps>`
  display: flex ${props => props.flexDirection || 'row'};
  justify-content: space-between;
  align-items: space-between;
`;

export const WithPadding = styled.div`
  padding: ${MARGIN_SIZES.medium} auto;
`;

export const Header = styled.h2<HeaderProps>`
  color: ${props => props.color ? props.theme[props.color] : props.theme.grey};
  font-weight: 300;
  font-size: ${FONT_SIZES.big};
  margin: ${props => props.margin ? MARGIN_SIZES[props.margin] : `${MARGIN_SIZES.big} 0`};
  padding: ${MARGIN_SIZES.small} ${MARGIN_SIZES.medium};
  text-align: ${props => props.textAlign || 'center'};
`;

export const DynamicSizeText = styled.p<DynamicSizeTextProps>`
  font-size: ${props => FONT_SIZES[props.fontSize || 'medium']};
  font-weight: ${props => props.fontWeight || 'light'};
  margin: 0 0;
  text-align: center;
`;

export const RefreshButton = styled.button`
  border: none;
  background-color: inherit;
  color: ${props => props.theme.lightBlue1};

  :hover {
    cursor: pointer;
    color: ${props => props.theme.darkBlue};
  }
`;

export const StyledNavLink = styled(Link) <StyledNavLinkProps>`
  background: none;
  border: none;
  color: ${props => props.inverted ? props.theme.white : props.theme.lightBlue2};
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
  color: ${props => props.color || props.theme.lightBlue2};
  display: flex;
  font-size: ${FONT_SIZES.medium};
  font-weight: 300;
  justify-content: space-between;

  :hover {
    cursor: pointer;
  }
`;

export const StyledNavButton = styled.button`
  background-image: linear-gradient(
    107deg,
    ${props => props.theme.purple},
    ${props => props.theme.lightBlue1} 71%,
    ${props => props.theme.lightBlue2}
  );
  border: none;
  border-radius: 15px;
  box-shadow: 0 4px 6px 0 rgba(${props => props.theme.black}, 0.3);
  color: ${props => props.theme.white};
  fontSize: ${FONT_SIZES.large};
  height: 42px;
  width: 134px;

  :hover {
    cursor: pointer;
  }
`;

export const VoteNayButton = styled.button`
background-image: linear-gradient(
    107deg,
    ${props => props.theme.hotPink},
    ${props => props.theme.electricPurple}
  );
  border: none;
  border-radius: 8px;
  box-shadow: 0 4px 6px 0 rgba(${props => props.theme.black}, 0.3);
  color: ${props => props.theme.white};
  fontSize: ${FONT_SIZES.large};
  height: 21px;
  width: 51px;

  :hover {
    cursor: pointer;
  }
`;

export const VoteYayButton = styled.button`
background-image: linear-gradient(
    107deg,
    ${props => props.theme.lightBlue1},
    ${props => props.theme.lightBlue2}
  );
  border: none;
  border-radius: 8px;
  box-shadow: 0 4px 6px 0 rgba(${props => props.theme.black}, 0.3);
  color: ${props => props.theme.white};
  fontSize: ${FONT_SIZES.large};
  height: 21px;
  width: 51px;

  :hover {
    cursor: pointer;
  }
`;

export const Stacked = styled.div<StackProps>`
  align-items: ${props => props.alignItems || 'center'};
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: ${props => props.justifyContent || 'center'};
  text-align: ${props => props.textAlign || 'center'};
`;

export const StackedHorizontal = styled.div<StackProps>`
  align-items: ${props => props.alignItems || 'center'};
  display: flex;
  flex: 1;
  flex-direction: row;
  justify-content: ${props => props.justifyContent || 'center'};
  text-align: ${props => props.textAlign || 'center'};
`;

export const SubHeader = styled.h3<SubHeaderProps>`
  color: ${props => props.theme.lightBlue2};
  font-weight: 600;
  font-size: ${FONT_SIZES.medium};
  margin: ${props => props.noMargin ? `0 0` : `1rem auto 0.3rem auto`};
  text-align: ${props => props.textAlign || 'center'};
`;

export const InlineSubHeader = styled(SubHeader)`
  display: inline;
`;

export const WrapperDiv = styled.div<WrapperDivProps>`
  padding: ${props => props.padding || '1rem'};
  width: ${props => props.width || '30rem'};
  height: ${props => props.height || '100%'};
`;
