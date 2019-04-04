// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Link } from 'react-router-dom';
import styled from 'styled-components';
import SUIContainer from 'semantic-ui-react/dist/commonjs/elements/Container';

import { HeaderProps, DynamicSizeTextProps, StackProps, SubHeaderProps, WithSpaceAroundProps } from './StyleProps';

export const Container = styled(SUIContainer)`
  padding: 1.5rem;
`;

export const FadedText = styled.p`
  color: ${props => props.theme.black};
  opacity: 0.5;
  text-align: center;
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
  margin: 1rem auto;
`;

export const WithSpaceAround = styled.div<WithSpaceAroundProps>`
  margin: ${props => props.margin || '1rem 1rem'};
  padding: ${props => props.padding || '1rem 1rem'};
`;

export const WithSpaceBetween = styled.div`
  display: flex;
  justify-content: space-between;
`;

export const WithPadding = styled.div`
  padding: 1rem auto;
`;

export const Header = styled.h2<HeaderProps>`
  color: ${props => props.color ? props.theme[props.color] : props.theme.grey};
  font-weight: 300;
  font-size: 28px;
  margin: ${props => props.margin || '2rem 0'};
  padding: 0.5rem 1rem;
  text-align: center;
`;

export const DynamicSizeText = styled.p<DynamicSizeTextProps>`
  font-size: ${props => props.fontSize || '20px'};
  font-weight: ${props => props.fontWeight || '500'};
  margin: 0 0;
  text-align: center;
`;

export const FileInputArea = styled.div`
  background-color: ${props => props.theme.white};
  box-shadow: 0 2px 4px 0 ${props => props.theme.black}, 0.5);
  height: 109px;
  text-align: center;
  width: 363px;
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

export const StyledNavLink = styled<any>(Link)`
  background: none;
  border: none;
  color: ${props => props.theme.lightBlue2};
  font-size: 15px;
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
  font-size: 15px;
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
  fontSize: 18px;
  height: 42px;
  width: 134px;

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
  min-width: 100%;
  text-align: ${props => props.textAlign || 'center'};
`;

export const SubHeader = styled.h3<SubHeaderProps>`
  color: ${props => props.theme.lightBlue2};
  font-weight: 600;
  font-size: 15px;
  margin: ${props => props.noMargin ? `0 0` : `1rem auto 0.3rem auto`};
  text-align: ${props => props.textAlign || 'center'};
`;

export const InlineSubHeader = styled(SubHeader)`
  display: inline;
`;
