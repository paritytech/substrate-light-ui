// Copyright 2017-2018 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import styled from 'styled-components';
import SUIInput from 'semantic-ui-react/dist/commonjs/elements/Input/Input';
import SUIContainer from 'semantic-ui-react/dist/commonjs/elements/Container';
import SUICard from 'semantic-ui-react/dist/commonjs/views/Card';

export const Container = styled(SUIContainer)`
  padding: 1.5rem;
`;

export const Card = styled<any>(SUICard)`
 &&& {
  width: 299px;
  height: 372px;
  border-radius: 2px;
  box-shadow: 0 4px 5px 1px rgba(0, 0, 0, 0.3);
  background-color: #ffffff;
 }
`;

export const FadedText = styled.p`
  color: black;
  opacity: 0.5;
  text-align: center;
  margin: 1rem auto;
`;

export const MarginTop = styled.div`
  margin-top: 1rem;
`;

export const WithSpace = styled.div`
  margin: 1rem auto;
`;

export const WithSpaceAround = styled.div<any>`
  margin: ${props => props.margin || '1rem 1rem'};
  padding: ${props => props.padding || '1rem 1rem'};
`;

export const WithPadding = styled.div`
  padding: 1rem auto;
`;

export const Header = styled.h2<any>`
  text-align: center;
  color: grey;
  font-weight: 300;
  font-size: 28px;
  padding: 0.5rem 1rem;
  margin: ${props => props.margin || '2rem 0'};
`;

export const Name = styled.p`
  font-size: 20px;
  font-weight: 500;
  margin: 0 0;
`;

export const FileInputArea = styled.div<any>`
  width: 363px;
  height: 109px;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.5);
  background-color: #ffffff;
  text-align: center;
`;

export const TextInputArea = styled(SUIInput)`
  &&& {
    min-width: 100%;
    height: $(props => props.height || 109px)
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.5);
    background-color: #ffffff;
    color: grey;
  }
`;

export const NavLinkSmall = styled.button`
  font-size: 15px;
  font-weight: 300;
  color: #51a0ec;
  background: none;
  border: none;

  :hover {
    cursor: pointer;
  }
`;

export const NavLinkBig = styled.button`
  box-shadow: 0 4px 6px 0 rgba(0, 0, 0, 0.3);
  background-image: linear-gradient(107deg, #8479f3, #53a0fd 71%, #51a0ec);
  width: 134px;
  height: 42px;
  border-radius: 15px;
  color: white;
  border: none;

  :hover {
    cursor: pointer;
  }
`;

// FIXME?: tslint complains without <any> since HTMLElement type doens't have props.align, etc.
// The correct way to fix this would be to create an interface that extends HTMLElement
// but at the moment that's overkill
export const Stacked = styled.div<any>`
  display: flex column;
  align-items: ${props => props.align || 'center'};
  justify-content: ${props => props.justify || 'center'};
  vertical-align: middle;
  text-align: ${props => props.textAlign || 'center'};
  min-height: 100%;
`;

export const SubHeader = styled.h3<any>`
  text-align: center;
  font-weight: 600;
  font-size: 15px;
  color: ${props => props.color || '#51a0ec'};
  margin: ${props => props.margin || '1rem auto 0.3rem auto'};
`;
