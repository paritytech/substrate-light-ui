// Copyright 2018-2020 @paritytech/Nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import styled from 'styled-components';

import { polkadotOfficialTheme } from './globalStyle';

interface CircleProps {
  fill: string;
  label?: string;
  radius?: number;
  withShadow?: boolean;
}

export function Circle(props: CircleProps): React.ReactElement {
  const { fill, label, radius = 20, withShadow = false } = props;

  const StyledCircle = styled.span`
    height: ${radius}px;
    width: ${radius}px;
    background-color: ${fill};
    background-image: ${`linear-gradient(
      107deg,
      ${polkadotOfficialTheme.lightBlue1},
      ${polkadotOfficialTheme.neonBlue}
    )`};
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    vertical-align: center;
    box-shadow: ${withShadow &&
      '0 6px 6px 0 rgba(0, 0, 0, 0.24), 0 0 6px 0 rgba(0, 0, 0, 0.12)'};
  `;

  const WhiteText = styled.p`
    color: #ffffff;
  `;

  return (
    <StyledCircle>
      <WhiteText>{label}</WhiteText>
    </StyledCircle>
  );
}
