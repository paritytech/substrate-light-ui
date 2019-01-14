// Copyright 2017-2018 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import styled from 'styled-components';
import SUIContainer from 'semantic-ui-react/dist/commonjs/elements/Container';
import SUICard from 'semantic-ui-react/dist/commonjs/views/Card';

import { WithSpaceAroundProps, SubHeaderProps, StackProps, HeaderProps } from './StyleProps';

export const Container = styled(SUIContainer)`
  padding: 1.5rem;
`;

export const Card = styled<any>(SUICard)`
 &&& {
  background-color: #ffffff;
  border-radius: 2px;
  box-shadow: 0 4px 5px 1px rgba(0, 0, 0, 0.3);
  height: 372px;
  width: 299px;
 }
`;

export const FadedText = styled.p`
  color: black;
  margin: 1rem auto;
  opacity: 0.5;
  text-align: center;
`;

export const MarginTop = styled.div`
  margin-top: 1rem;
`;

export const WithSpace = styled.div`
  margin: 1rem auto;
`;

export const WithSpaceAround = styled.div<WithSpaceAroundProps>`
  margin: ${props => props.margin || '1rem 1rem'};
  padding: ${props => props.padding || '1rem 1rem'};
`;

export const WithPadding = styled.div`
  padding: 1rem auto;
`;

export const Header = styled.h2<HeaderProps>`
  color: grey;
  font-weight: 300;
  font-size: 28px;
  margin: ${props => props.margin || '2rem 0'};
  padding: 0.5rem 1rem;
  text-align: center;
`;

export const Name = styled.p`
  font-size: 20px;
  font-weight: 500;
  margin: 0 0;
`;

export const FileInputArea = styled.div`
  background-color: #ffffff;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.5);
  height: 109px;
  text-align: center;
  width: 363px;
`;

export const NavLinkSmall = styled.button`
  background: none;
  border: none;
  color: #51a0ec;
  font-size: 15px;
  font-weight: 300;

  :hover {
    cursor: pointer;
  }
`;

export const NavLinkBig = styled.button`
  background-image: linear-gradient(107deg, #8479f3, #53a0fd 71%, #51a0ec);
  border: none;
  border-radius: 15px;
  box-shadow: 0 4px 6px 0 rgba(0, 0, 0, 0.3);
  color: white;
  height: 42px;
  width: 134px;

  :hover {
    cursor: pointer;
  }
`;

export const Stacked = styled.div<StackProps>`
  align-items: ${props => props.align || 'center'};
  display: flex column;
  justify-content: ${props => props.justify || 'center'};
  min-height: 100%;
  text-align: ${props => props.textAlign || 'center'};
  vertical-align: middle;
`;

export const SubHeader = styled.h3<SubHeaderProps>`
  color: ${props => props.color || '#51a0ec'};
  font-weight: 600;
  font-size: 15px;
  margin: ${props => props.margin || '1rem auto 0.3rem auto'};
  text-align: center;
`;
