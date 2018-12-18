// Copyright 2017-2018 @polkadot/light-apps authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import styled from 'styled-components';
import { NavLink } from 'react-router-dom';

export const Stacked = styled.div`
  display: 'flex column';
  align-items: 'center';
  justify-content: 'center';
  min-height: 100%;
`;

export const FadedText = styled.p`
  color: #f4f4f4;
  opacity: 0.5;
`;

export const NavLinkSmall = styled(NavLink)`
  &&& {
    font-size: 15px;
    font-weight: 300;
    color: #51a0ec;
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
