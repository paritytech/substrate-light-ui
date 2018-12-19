// Copyright 2017-2018 @polkadot/light-apps authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import styled from 'styled-components';
import SUIInput from 'semantic-ui-react/dist/commonjs/elements/Input/Input';

export const FadedText = styled.p`
  color: black;
  opacity: 0.5;
  text-align: center;
  margin: 1rem auto;
`;

export const Header = styled.h2`
  text-align: center;
  color: grey;
  font-weight: 300;
  font-size: 28px;
  padding: 0.5rem 1rem;
  margin: 2rem 0;
`;

export const InputArea = styled.div`
  width: 363px;
  height: 109px;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.5);
  background-color: #ffffff;
  text-align: center;
`;

export const TextInputArea = styled(SUIInput)`
  &&& {
    width: 363px;
    height: 109px;
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.5);
    background-color: #ffffff;
    overflow: wrap;
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

export const Stacked = styled.div`
  display: flex column;
  align-items: center;
  justify-content: center;
  min-height: 100%;
`;

export const SubHeader = styled.h3`
  text-align: center;
  font-weight: 600;
  font-size: 15px;
  color: #51a0ec;
  margin: 1rem auto;
`;
