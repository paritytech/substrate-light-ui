// Copyright 2018-2020 @paritytech/Nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import styled from 'styled-components';

export const ThemeCardColorBlack = styled.div`
  position: relative;
  width: 100px;
  height: 100px;
  border-radius: 10px;
  margin: 1rem 1rem 2.5rem;
  display: inline-block;
  &:before {
    position: absolute;
    bottom: -1.5rem;
    text-align: center;
    text-transform: uppercase;
    font-family: sans-serif;
    width: 100%;
  }
  background: ${({ theme }): any => theme.black};
  &:before {
    content: "${({ theme }): any => theme.black}";
  }
`;
