// Copyright 2018-2020 @paritytech/Nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import styled from 'styled-components';

interface CircleProps {
  label?: string;
  radius?: number;
  withShadow?: boolean;
  className?: string;
}

interface StyledCircleProps {
  radius: number;
  withShadow: boolean;
}

const StyledCircle = styled.span<StyledCircleProps>`
  height: ${(props): number => props.radius}px;
  width: ${(props): number => props.radius}px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  vertical-align: center;
  box-shadow: ${(props): string =>
    props.withShadow
      ? '0 6px 6px 0 rgba(0, 0, 0, 0.24), 0 0 6px 0 rgba(0, 0, 0, 0.12)'
      : ''};
`;

export function Circle(props: CircleProps): React.ReactElement {
  const { className, label, radius = 20, withShadow = false } = props;

  return (
    <StyledCircle className={className} radius={radius} withShadow={withShadow}>
      {label}
    </StyledCircle>
  );
}
