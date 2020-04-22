// Copyright 2018-2020 @paritytech/Nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import styled from 'styled-components';

import { mergeClasses } from './NavButton';

interface LayoutProps {
  children?: React.ReactNode;
  className?: string;
}

const StyledLayout = styled.div``;

// TEMPORARY, to be moved to shared/constants
const tachyons = {
  default: 'flex items-center',
};

export function Layout(props: LayoutProps): React.ReactElement {
  const { children, className, ...rest } = props;

  const tachyonsClass = tachyons['default'];

  return (
    <StyledLayout
      className={
        className == undefined
          ? tachyonsClass
          : mergeClasses(tachyonsClass, className)
      }
      {...rest}
    >
      {children}
    </StyledLayout>
  );
}
